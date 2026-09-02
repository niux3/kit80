import { describe, it, expect, beforeEach, vi } from 'vitest'
import { withKit80 } from '../src/core/ComponentMixin.js'

describe('withKit80 Mixin', () => {
    class DummyBaseElement extends HTMLElement { }

    let mockContainer
    let mockGlobalState
    let mockView
    let mockApi
    let elementCount = 0

    // Helper pour déclarer et instancier un Custom Element proprement sous Happy DOM
    const createTestElement = (ComponentClass) => {
        const tagName = `test-elem-${++elementCount}`
        if (!customElements.get(tagName)) {
            customElements.define(tagName, ComponentClass)
        }
        return document.createElement(tagName)
    }

    beforeEach(() => {
        mockGlobalState = {
            set: vi.fn(),
            get: vi.fn().mockReturnValue({ theme: 'dark' })
        }

        mockView = {
            templateEngine: {
                render: vi.fn((tpl, ctx) => `RENDERED: ${tpl} | ${JSON.stringify(ctx)}`)
            },
            urlFor: vi.fn((name, params) => `/routes/${name}?id=${params.id || ''}`)
        }

        mockApi = { get: vi.fn() }

        mockContainer = {
            get: vi.fn((service) => {
                switch (service) {
                    case 'globalState': return mockGlobalState
                    case 'view': return mockView
                    case 'api': return mockApi
                    default: return null
                }
            })
        }
    })

    describe('HOC wrapping & Double-wrap prevention', () => {
        it('should return a class that extends the BaseClass and flags _isKit80Component', () => {
            const EnhancedClass = withKit80(DummyBaseElement)
            expect(EnhancedClass._isKit80Component).toBe(true)
        })

        it('should avoid double-wrapping an already enhanced class', () => {
            const FirstWrap = withKit80(DummyBaseElement)
            const SecondWrap = withKit80(FirstWrap)

            expect(SecondWrap).toBe(FirstWrap)
        })
    })

    describe('Initialization without Container (Fallback mode)', () => {
        let UnboundElement

        beforeEach(() => {
            UnboundElement = withKit80(class extends HTMLElement { })
            UnboundElement.setContainer(null)
        })

        it('should initialize fallback template engine and null services when no container is provided', () => {
            const instance = createTestElement(UnboundElement)

            expect(instance._container).toBeNull()
            expect(instance._view).toBeNull()
            expect(instance._api).toBeNull()
            expect(instance.getApi()).toBeNull()
            expect(instance._templateEngine).toBeDefined()
        })

        it('should fallback urlFor() to relative path pattern /:name when view service is absent', () => {
            const instance = createTestElement(UnboundElement)
            expect(instance.urlFor('profile')).toBe('/profile')
        })

        it('should return undefined safely for getCtx() and setCtx() when container is absent', () => {
            const instance = createTestElement(UnboundElement)
            expect(instance.getCtx('theme')).toBeUndefined()
            expect(() => instance.setCtx('theme', 'light')).not.toThrow()
        })
    })

    describe('Initialization with Container (Bound mode)', () => {
        let BoundElement

        beforeEach(() => {
            BoundElement = withKit80(class extends HTMLElement { })
            BoundElement.setContainer(mockContainer)
        })

        it('should resolve view, api, and container references from IoC container', () => {
            const instance = createTestElement(BoundElement)

            expect(instance._view).toBe(mockView)
            expect(instance._api).toBe(mockApi)
            expect(instance.getApi()).toBe(mockApi)
            expect(instance._container).toBe(mockContainer)
        })

        it('should proxy getService() to IoC container', () => {
            const instance = createTestElement(BoundElement)
            instance.getService('api')

            expect(mockContainer.get).toHaveBeenCalledWith('api')
        })

        it('should proxy setCtx() and getCtx() to GlobalState', () => {
            const instance = createTestElement(BoundElement)

            instance.setCtx('lang', 'fr')
            expect(mockGlobalState.set).toHaveBeenCalledWith('lang', 'fr')

            instance.getCtx('theme')
            expect(mockGlobalState.get).toHaveBeenCalledWith('theme')
        })

        it('should delegate urlFor() to view service when available', () => {
            const instance = createTestElement(BoundElement)
            const url = instance.urlFor('user', { id: 42 })

            expect(mockView.urlFor).toHaveBeenCalledWith('user', { id: 42 })
            expect(url).toBe('/routes/user?id=42')
        })

        it('should merge global state context with local context when rendering templates', () => {
            const instance = createTestElement(BoundElement)
            const template = '<h1>{{ title }} - {{ theme }}</h1>'
            const localCtx = { title: 'Dashboard' }

            instance.render(template, localCtx)

            expect(mockView.templateEngine.render).toHaveBeenCalledWith(
                template,
                { theme: 'dark', title: 'Dashboard' }
            )
        })
    })
})
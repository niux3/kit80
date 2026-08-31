// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Explicit mock of the template engine using fluent chaining
vi.mock('@niuxe/template-engine', () => {
    return {
        TemplateEngine: vi.fn().mockImplementation(function () {
            this.use = vi.fn().mockReturnValue(this)
            this.partial = vi.fn().mockReturnValue(this)
            this.layout = vi.fn().mockReturnValue(this)
            this.helper = vi.fn().mockReturnValue(this)
            this.render = vi.fn().mockReturnValue('')
        })
    }
})

vi.mock('@niuxe/template-engine/plugins', () => ({
    PartialsPlugin: {},
    LayoutPlugin: {},
    HelpersPlugin: {},
    StrictModePlugin: {},
    I18nPlugin: {}
}))

vi.mock('../src/core/Dispatcher', () => {
    return {
        Dispatcher: vi.fn().mockImplementation(function () {
            this.run = vi.fn()
            this.use = vi.fn().mockReturnThis()
        })
    }
})

import { Kit80 } from '../src/core/Kit80'

describe('Kit80', () => {
    let app

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>'
        app = new Kit80('app')
    })

    it('should instantiate correctly and expose the container', () => {
        expect(app.container).toBeDefined()
    })

    it('should register all default services in the container', () => {
        const container = app.container

        expect(container.has('views')).toBe(true)
        expect(container.has('partials')).toBe(true)
        expect(container.has('layouts')).toBe(true)
        expect(container.has('templateEngine')).toBe(true)
        expect(container.has('view')).toBe(true)
        expect(container.has('api')).toBe(true)
    })

    it('should configure the template engine with its plugins', () => {
        const templateEngine = app.container.get('templateEngine')

        expect(templateEngine.use).toHaveBeenCalledTimes(5)
    })

    it('should instantiate container-dependent services (e.g., View)', () => {
        const viewService = app.container.get('view')
        expect(viewService).toBeDefined()
    })

    it('should invoke the Dispatcher run() method when calling app.run()', () => {
        const runSpy = vi.spyOn(app['_dispatcher'], 'run')
        const useSpy = vi.spyOn(app['_dispatcher'], 'use')

        const result = app.run()

        expect(useSpy).toHaveBeenCalledWith('afterRender', expect.any(Function))
        expect(runSpy).toHaveBeenCalledOnce()
        expect(result).toBe(app)
    })

    describe('_registerComponents', () => {
        beforeEach(() => {
            vi.restoreAllMocks()
        })

        it('should dynamically register custom elements in W3C registry', () => {
            class DummyComponent extends HTMLElement { }

            vi.spyOn(app, '_getGlobComponents').mockReturnValue({
                '../controllers/components/UiTestBadge.js': {
                    UiTestBadge: DummyComponent
                }
            })

            app['_registerComponents']()

            expect(customElements.get('ui-test-badge')).toBe(DummyComponent)
        })

        it('should handle default export when named export is missing', () => {
            class DefaultComponent extends HTMLElement { }

            vi.spyOn(app, '_getGlobComponents').mockReturnValue({
                '../controllers/components/UiDefaultWidget.js': {
                    default: DefaultComponent
                }
            })

            app['_registerComponents']()

            expect(customElements.get('ui-default-widget')).toBe(DefaultComponent)
        })

        it('should not throw or re-define an already registered custom element', () => {
            class AlreadyDefinedComponent extends HTMLElement { }

            if (!customElements.get('ui-already-defined')) {
                customElements.define('ui-already-defined', AlreadyDefinedComponent)
            }

            const defineSpy = vi.spyOn(customElements, 'define')

            vi.spyOn(app, '_getGlobComponents').mockReturnValue({
                '../controllers/components/UiAlreadyDefined.js': {
                    UiAlreadyDefined: AlreadyDefinedComponent
                }
            })

            app['_registerComponents']()

            expect(defineSpy).not.toHaveBeenCalledWith('ui-already-defined', expect.any(Function))
        })
    })
})
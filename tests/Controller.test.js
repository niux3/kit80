// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Controller } from '../src/core/Controller'

describe('Controller', () => {
    let containerMock
    let viewMock
    let controller

    beforeEach(() => {
        viewMock = {
            render: vi.fn((template, ctx) => `<div>${template}</div>`),
            urlFor: vi.fn((name, params) => `/mocked/${name}`)
        }

        containerMock = {
            get: vi.fn((service) => (service === 'view' ? viewMock : null))
        }

        controller = new Controller(containerMock)
    })

    it('should initialize with default properties', () => {
        expect(controller.getCtx()).toEqual({})
        expect(controller.getTitle()).toBe('')
    })

    it('should allow setting and getting title with fluid chaining', () => {
        const instance = controller.setTitle('Dashboard')

        expect(controller.getTitle()).toBe('Dashboard')
        expect(instance).toBe(controller) // Vérifie le chainage (return this)
    })

    it('should manage internal context store via setCtx and getCtx', () => {
        controller.setCtx('user', 'Alice')
        controller.setCtx('role', 'admin')

        expect(controller.getCtx()).toEqual({
            user: 'Alice',
            role: 'admin'
        })
    })

    it('should merge internal context with render context when calling render()', () => {
        controller.setCtx('globalData', 'foo')

        const output = controller.render('pages/home', { localData: 'bar' })

        expect(viewMock.render).toHaveBeenCalledWith('pages/home', {
            globalData: 'foo',
            localData: 'bar'
        })
        expect(output).toBe('<div>pages/home</div>')
    })

    it('should dispatch "spa:navigate" CustomEvent and return false on redirect()', () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

        const result = controller.redirect('/login')

        expect(result).toBe(false)
        expect(dispatchSpy).toHaveBeenCalledOnce()

        const eventArg = dispatchSpy.mock.calls[0][0]
        expect(eventArg).toBeInstanceOf(CustomEvent)
        expect(eventArg.type).toBe('spa:navigate')
        expect(eventArg.detail).toEqual({ url: '/login' })
    })

    it('should delegate urlFor calls to the view service', () => {
        const url = controller.urlFor('user.profile', { id: 42 })

        expect(viewMock.urlFor).toHaveBeenCalledWith('user.profile', { id: 42 })
        expect(url).toBe('/mocked/user.profile')
    })
})
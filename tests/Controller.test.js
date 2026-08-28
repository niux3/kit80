// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Controller } from '../src/core/Controller'

describe('Controller', () => {
    let containerMock
    let viewMock
    let controller

    beforeEach(() => {
        // Mock of the view service
        viewMock = {
            render: vi.fn((template, ctx) => `<h1>Rendered ${template}</h1>`),
            urlFor: vi.fn((name) => `/mock-url/${name}`)
        }

        // Mock of the IoC Container
        containerMock = {
            get: vi.fn((service) => {
                if (service === 'view') return viewMock
                return null
            })
        }

        controller = new Controller(containerMock)
    })

    it('should retrieve the view service from the container upon instantiation', () => {
        expect(containerMock.get).toHaveBeenCalledWith('view')
    })

    it('should manage the internal context (_ctx) using setCtx and getCtx', () => {
        controller.setCtx('title', 'My Title')
        controller.setCtx('user', { name: 'Alex' })

        expect(controller.getCtx()).toEqual({
            title: 'My Title',
            user: { name: 'Alex' }
        })
    })

    it('should merge internal context (_ctx) with local context passed to render()', () => {
        controller.setCtx('globalData', '123')

        controller.render('home', { localData: '456' })

        expect(viewMock.render).toHaveBeenCalledWith('home', {
            globalData: '123',
            localData: '456'
        })
    })

    it('should delegate urlFor calls to the view service', () => {
        const url = controller.urlFor('contact')

        expect(viewMock.urlFor).toHaveBeenCalledWith('contact')
        expect(url).toBe('/mock-url/contact')
    })

    it('should dispatch a "spa:navigate" CustomEvent and return false on redirect', () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

        const result = controller.redirect('/dashboard')

        expect(result).toBe(false)
        expect(dispatchSpy).toHaveBeenCalledOnce()

        // Verify emitted event payload
        const event = dispatchSpy.mock.calls[0][0]
        expect(event.type).toBe('spa:navigate')
        expect(event.detail).toEqual({ url: '/dashboard' })

        dispatchSpy.mockRestore()
    })
})
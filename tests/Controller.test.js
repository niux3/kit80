// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Controller } from '../src/core/Controller'

describe('Controller', () => {
    let containerMock
    let viewMock
    let controller

    beforeEach(() => {
        // Mock du service de vue
        viewMock = {
            render: vi.fn((template, ctx) => `<h1>Rendered ${template}</h1>`),
            urlFor: vi.fn((name) => `/mock-url/${name}`)
        }

        // Mock du Container IoC
        containerMock = {
            get: vi.fn((service) => {
                if (service === 'view') return viewMock
                return null
            })
        }

        controller = new Controller(containerMock)
    })

    it("doit récupérer le service view depuis le container à l'instanciation", () => {
        expect(containerMock.get).toHaveBeenCalledWith('view')
    })

    it("doit gérer le contexte (_ctx) avec setCtx et getCtx", () => {
        controller.setCtx('title', 'Mon Titre')
        controller.setCtx('user', { name: 'Alex' })

        expect(controller.getCtx()).toEqual({
            title: 'Mon Titre',
            user: { name: 'Alex' }
        })
    })

    it("doit combiner le contexte interne (_ctx) et le contexte passe a render()", () => {
        controller.setCtx('globalData', '123')

        controller.render('home', { localData: '456' })

        expect(viewMock.render).toHaveBeenCalledWith('home', {
            globalData: '123',
            localData: '456'
        })
    })

    it("doit appeler urlFor sur le service de vue", () => {
        const url = controller.urlFor('contact')

        expect(viewMock.urlFor).toHaveBeenCalledWith('contact')
        expect(url).toBe('/mock-url/contact')
    })

    it("doit emettre un CustomEvent 'spa:navigate' et retourner false lors d'une redirection", () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

        const result = controller.redirect('/dashboard')

        expect(result).toBe(false)
        expect(dispatchSpy).toHaveBeenCalledOnce()

        // Verification du contenu de l'evenement emis
        const event = dispatchSpy.mock.calls[0][0]
        expect(event.type).toBe('spa:navigate')
        expect(event.detail).toEqual({ url: '/dashboard' })

        dispatchSpy.mockRestore()
    })
})
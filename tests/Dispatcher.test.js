// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Dispatcher } from '../src/core/Dispatcher'

describe('Dispatcher', () => {
    let dispatcher
    let containerMock
    let appContainer

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>'
        appContainer = document.getElementById('app')

        containerMock = {
            get: vi.fn()
        }

        const configuration = {
            appContainer,
            debug: false
        }

        dispatcher = new Dispatcher(configuration, containerMock)

        // Mock du Router interne
        dispatcher.router = {
            getMatch: vi.fn()
        }
    })

    it('doit exécuter le cycle complet (resolve, action, render) pour une route valide', async () => {
        // 1. Mock de la route trouvée par le Router
        dispatcher.router.getMatch.mockReturnValue({
            route: { name: 'home', path: '/' },
            controller: 'HomeController',
            action: 'index',
            params: {}
        })

        // 2. Mock du Controller résolu
        const fakeController = {
            index: vi.fn().mockResolvedValue('<h1>Bienvenue</h1>'),
            destroy: vi.fn()
        }
        vi.spyOn(dispatcher, '_resolveController').mockResolvedValue(fakeController)

        // 3. Exécution du dispatch
        await dispatcher._dispatch()

        expect(fakeController.index).toHaveBeenCalledOnce()
        expect(appContainer.innerHTML).toBe('<h1>Bienvenue</h1>')
        expect(dispatcher.activePage).toBe(fakeController)
    })

    it('doit appeler destroy sur l\'ancienne page lors d\'un changement de route', async () => {
        const oldController = { destroy: vi.fn() }
        dispatcher.activePage = oldController

        dispatcher.router.getMatch.mockReturnValue({
            route: { name: 'about', path: '/about' },
            controller: 'AboutController',
            action: 'index',
            params: {}
        })

        const newController = {
            index: vi.fn().mockResolvedValue('<h2>A propos</h2>')
        }
        vi.spyOn(dispatcher, '_resolveController').mockResolvedValue(newController)

        await dispatcher._dispatch()

        expect(oldController.destroy).toHaveBeenCalledOnce()
        expect(appContainer.innerHTML).toBe('<h2>A propos</h2>')
    })

    it('doit interrompre le dispatch si un middleware de beforeLoad retourne false', async () => {
        dispatcher.router.getMatch.mockReturnValue({
            route: { name: 'admin', path: '/admin' },
            controller: 'AdminController',
            action: 'index',
            params: {}
        })

        const resolveSpy = vi.spyOn(dispatcher, '_resolveController')

        // On enregistre un middleware qui bloque l'accès
        dispatcher.use('beforeLoad', () => false)

        await dispatcher._dispatch()

        // Le contrôleur ne doit jamais être instancié ni rendu
        expect(resolveSpy).not.toHaveBeenCalled()
        expect(appContainer.innerHTML).toBe('')
    })

    it('doit intercepter l\'événement custom "spa:navigate" pour naviguer', () => {
        const navigateSpy = vi.spyOn(dispatcher, 'navigateTo').mockImplementation(() => { })

        dispatcher.run()

        window.dispatchEvent(new CustomEvent('spa:navigate', {
            detail: { url: '/contact' }
        }))

        expect(navigateSpy).toHaveBeenCalledWith('/contact')
    })
})
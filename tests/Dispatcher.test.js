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

        // Mock internal Router
        dispatcher.router = {
            getMatch: vi.fn()
        }
    })

    it('should execute the full lifecycle (resolve, action, render) for a valid route', async () => {
        // 1. Mock matched route from Router
        dispatcher.router.getMatch.mockReturnValue({
            route: { name: 'home', path: '/' },
            controller: 'HomeController',
            action: 'index',
            params: {}
        })

        // 2. Mock resolved Controller instance
        const fakeController = {
            index: vi.fn().mockResolvedValue('<h1>Welcome</h1>'),
            destroy: vi.fn()
        }
        vi.spyOn(dispatcher, '_resolveController').mockResolvedValue(fakeController)

        // 3. Execute dispatch execution
        await dispatcher._dispatch()

        expect(fakeController.index).toHaveBeenCalledOnce()
        expect(appContainer.innerHTML).toBe('<h1>Welcome</h1>')
        expect(dispatcher.activePage).toBe(fakeController)
    })

    it('should call destroy on the previous page instance during route transition', async () => {
        const oldController = { destroy: vi.fn() }
        dispatcher.activePage = oldController

        dispatcher.router.getMatch.mockReturnValue({
            route: { name: 'about', path: '/about' },
            controller: 'AboutController',
            action: 'index',
            params: {}
        })

        const newController = {
            index: vi.fn().mockResolvedValue('<h2>About Us</h2>')
        }
        vi.spyOn(dispatcher, '_resolveController').mockResolvedValue(newController)

        await dispatcher._dispatch()

        expect(oldController.destroy).toHaveBeenCalledOnce()
        expect(appContainer.innerHTML).toBe('<h2>About Us</h2>')
    })

    it('should halt dispatch if a beforeLoad middleware returns false', async () => {
        dispatcher.router.getMatch.mockReturnValue({
            route: { name: 'admin', path: '/admin' },
            controller: 'AdminController',
            action: 'index',
            params: {}
        })

        const resolveSpy = vi.spyOn(dispatcher, '_resolveController')

        // Register middleware blocking execution
        dispatcher.use('beforeLoad', () => false)

        await dispatcher._dispatch()

        // Controller should neither be resolved nor rendered
        expect(resolveSpy).not.toHaveBeenCalled()
        expect(appContainer.innerHTML).toBe('')
    })

    it('should intercept the "spa:navigate" CustomEvent to perform navigation', () => {
        const navigateSpy = vi.spyOn(dispatcher, 'navigateTo').mockImplementation(() => { })

        dispatcher.run()

        window.dispatchEvent(new CustomEvent('spa:navigate', {
            detail: { url: '/contact' }
        }))

        expect(navigateSpy).toHaveBeenCalledWith('/contact')
    })
})
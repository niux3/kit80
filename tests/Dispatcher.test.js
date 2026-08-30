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

        // Mock internal Router (_router)
        dispatcher._router = {
            getMatch: vi.fn()
        }
    })

    it('should execute the full lifecycle (resolve, action, render) for a valid route', async () => {
        const routeMatch = {
            name: 'home',
            path: '/',
            controller: 'HomeController',
            action: 'index',
            params: {}
        }
        dispatcher._router.getMatch.mockReturnValue(routeMatch)

        const fakeController = {
            index: vi.fn().mockResolvedValue('<h1>Welcome</h1>'),
            destroy: vi.fn()
        }
        vi.spyOn(dispatcher, '_resolveController').mockResolvedValue(fakeController)

        await dispatcher._dispatch()

        expect(fakeController.index).toHaveBeenCalledOnce()
        expect(appContainer.innerHTML).toBe('<h1>Welcome</h1>')
        expect(dispatcher._activePage).toBe(fakeController)
    })

    it('should manage _activeContext lifecycle and populate "from" on subsequent navigation', async () => {
        // 1. Initial state check
        expect(dispatcher._activeContext).toBeNull()

        // 2. First navigation (Home)
        const homeRoute = {
            name: 'home',
            path: '/',
            controller: 'HomeController',
            action: 'index',
            params: {}
        }
        dispatcher._router.getMatch.mockReturnValue(homeRoute)

        const homeController = {
            index: vi.fn().mockImplementation(async (ctx) => {
                expect(ctx.from).toBeNull() // First visit, no previous page
                return '<h1>Home</h1>'
            })
        }
        vi.spyOn(dispatcher, '_resolveController').mockResolvedValue(homeController)

        await dispatcher._dispatch()

        // Verify _activeContext was updated after render
        expect(dispatcher._activeContext).not.toBeNull()
        expect(dispatcher._activeContext.route).toEqual(homeRoute)
        expect(dispatcher._activeContext.controller).toBe(homeController)

        // 3. Second navigation (About page)
        const aboutRoute = {
            name: 'about',
            path: '/about',
            controller: 'AboutController',
            action: 'index',
            params: { id: '42' }
        }
        dispatcher._router.getMatch.mockReturnValue(aboutRoute)

        const aboutController = {
            index: vi.fn().mockImplementation(async (ctx) => {
                // Verify `from` context passed to the new controller
                expect(ctx.from).toEqual({
                    route: homeRoute,
                    params: {},
                    query: {},
                    controller: homeController
                })
                return '<h2>About</h2>'
            })
        }
        dispatcher._resolveController.mockResolvedValue(aboutController)

        await dispatcher._dispatch()

        // Verify _activeContext reflects the new page state
        expect(dispatcher._activeContext.route).toEqual(aboutRoute)
        expect(dispatcher._activeContext.controller).toBe(aboutController)
    })

    it('should call destroy on the previous page instance during route transition', async () => {
        const oldController = { destroy: vi.fn() }
        dispatcher._activePage = oldController

        dispatcher._router.getMatch.mockReturnValue({
            name: 'about',
            path: '/about',
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
        dispatcher._router.getMatch.mockReturnValue({
            name: 'admin',
            path: '/admin',
            controller: 'AdminController',
            action: 'index',
            params: {}
        })

        const resolveSpy = vi.spyOn(dispatcher, '_resolveController')

        dispatcher.use('beforeLoad', () => false)

        await dispatcher._dispatch()

        expect(resolveSpy).not.toHaveBeenCalled()
        expect(appContainer.innerHTML).toBe('')
        expect(dispatcher._activeContext).toBeNull()
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
import { describe, it, expect, vi } from 'vitest'
import { Middleware } from '../src/core/Middleware'

describe('Middleware', () => {
    it('doit exécuter les hooks enregistrés', async () => {
        const middleware = new Middleware()
        let executed = false

        middleware.register('beforeLoad', () => {
            executed = true
        })

        await middleware.trigger('beforeLoad', {})
        expect(executed).toBe(true)
    })

    it('doit stopper la chaîne si un hook retourne false', async () => {
        const middleware = new Middleware()
        let secondExecuted = false

        middleware.register('beforeLoad', () => false)
        middleware.register('beforeLoad', () => { secondExecuted = true })

        const result = await middleware.trigger('beforeLoad', {})
        expect(result).toBe(false)
        expect(secondExecuted).toBe(false)
    })

    it('doit exécuter le hook local sur l\'instance du contrôleur', async () => {
        const middleware = new Middleware()
        const fakeController = {
            beforeRender: vi.fn()
        }

        await middleware.trigger('beforeRender', {}, fakeController)
        expect(fakeController.beforeRender).toHaveBeenCalledOnce()
    })

    it('doit stopper si le hook local du contrôleur retourne false', async () => {
        const middleware = new Middleware()
        const fakeController = {
            beforeRender: () => false
        }

        const result = await middleware.trigger('beforeRender', {}, fakeController)
        expect(result).toBe(false)
    })

    it('doit passer le contexte correctement aux callbacks et au contrôleur', async () => {
        const middleware = new Middleware()
        const context = { route: '/admin' }
        let receivedContext = null

        middleware.register('beforeLoad', (ctx) => {
            receivedContext = ctx
        })

        await middleware.trigger('beforeLoad', context)
        expect(receivedContext).toEqual({ route: '/admin' })
    })
})
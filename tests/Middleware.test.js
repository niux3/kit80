import { describe, it, expect, vi } from 'vitest'
import { Middleware } from '../src/core/Middleware'

describe('Middleware', () => {
    it('should execute registered hooks', async () => {
        const middleware = new Middleware()
        let executed = false

        middleware.register('beforeLoad', () => {
            executed = true
        })

        await middleware.trigger('beforeLoad', {})
        expect(executed).toBe(true)
    })

    it('should short-circuit the execution chain if a hook returns false', async () => {
        const middleware = new Middleware()
        let secondExecuted = false

        middleware.register('beforeLoad', () => false)
        middleware.register('beforeLoad', () => { secondExecuted = true })

        const result = await middleware.trigger('beforeLoad', {})
        expect(result).toBe(false)
        expect(secondExecuted).toBe(false)
    })

    it('should execute the local hook defined on the controller instance', async () => {
        const middleware = new Middleware()
        const fakeController = {
            beforeRender: vi.fn()
        }

        await middleware.trigger('beforeRender', {}, fakeController)
        expect(fakeController.beforeRender).toHaveBeenCalledOnce()
    })

    it('should halt execution if the controller local hook returns false', async () => {
        const middleware = new Middleware()
        const fakeController = {
            beforeRender: () => false
        }

        const result = await middleware.trigger('beforeRender', {}, fakeController)
        expect(result).toBe(false)
    })

    it('should pass the context object correctly to callbacks and controller hooks', async () => {
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
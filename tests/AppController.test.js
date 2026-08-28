// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppController } from '../src/controller/AppController'

class CustomChildController extends AppController {
    setDate(dateString) {
        this.setCtx('currentDate', dateString)
    }

    async afterLoad(ctx) {
        if (ctx?.shouldCancel) return false
        this.setCtx('loaded', true)
        return true
    }

    async beforeRender(ctx) {
        if (ctx?.unauthorized) return false
        this.setCtx('user', ctx?.user || 'Guest')
        return true
    }

    async afterRender(ctx) {
        this.setCtx('renderedAt', 'done')
        return true
    }
}

describe('AppController', () => {
    let containerMock
    let viewMock
    let controller
    // Minimal mock for the route context required by AppController
    let mockCtx

    beforeEach(() => {
        viewMock = {
            render: vi.fn((template, ctx) => `<div>${template}</div>`)
        }

        containerMock = {
            get: vi.fn((service) => (service === 'view' ? viewMock : null))
        }

        controller = new CustomChildController(containerMock)

        mockCtx = {
            route: {
                route: {
                    name: 'home'
                }
            }
        }
    })

    it('should provide default hooks that execute without error with a valid context', async () => {
        const baseController = new AppController(containerMock)

        // Pass mockCtx instead of {} to satisfy ctx.route.route.name
        await expect(baseController.afterLoad(mockCtx)).resolves.not.toThrow()
        await expect(baseController.beforeRender(mockCtx)).resolves.not.toThrow()
        await expect(baseController.afterRender(mockCtx)).resolves.not.toThrow()
    })

    it('should execute afterLoad and populate context', async () => {
        const result = await controller.afterLoad(mockCtx)

        expect(result).toBe(true)
        expect(controller.getCtx()).toEqual(
            expect.objectContaining({
                loaded: true,
                date: expect.any(Date)
            })
        )
    })

    it('should execute beforeRender, populate context, and halt execution if unauthorized', async () => {
        const success = await controller.beforeRender({ ...mockCtx, user: 'Alice' })

        expect(success).toBe(true)
        expect(controller.getCtx()).toEqual(
            expect.objectContaining({
                user: 'Alice'
            })
        )

        const failure = await controller.beforeRender({ ...mockCtx, unauthorized: true })
        expect(failure).toBe(false)
    })

    it('should execute afterRender and mark the rendering phase as completed', async () => {
        const result = await controller.afterRender(mockCtx)

        expect(result).toBe(true)
        expect(controller.getCtx()).toEqual(
            expect.objectContaining({
                renderedAt: 'done'
            })
        )
    })

    it('should accumulate context modifications from all 3 hooks and setDate upon render()', async () => {
        await controller.afterLoad(mockCtx)
        await controller.beforeRender({ ...mockCtx, user: 'Bob' })
        await controller.afterRender(mockCtx)
        controller.setDate('2026-08-28')

        controller.render('dashboard', { title: 'Dashboard' })

        expect(viewMock.render).toHaveBeenCalledWith(
            'dashboard',
            expect.objectContaining({
                loaded: true,
                user: 'Bob',
                renderedAt: 'done',
                currentDate: '2026-08-28',
                title: 'Dashboard',
                date: expect.any(Date)
            })
        )
    })
})
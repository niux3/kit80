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
    // Mock minimal du contexte de route requis par AppController
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

    it('doit fournir des hooks par défaut qui s\'exécutent sans erreur avec un contexte valide', async () => {
        const baseController = new AppController(containerMock)

        // On passe mockCtx au lieu de {} pour satisfaire ctx.route.route.name
        await expect(baseController.afterLoad(mockCtx)).resolves.not.toThrow()
        await expect(baseController.beforeRender(mockCtx)).resolves.not.toThrow()
        await expect(baseController.afterRender(mockCtx)).resolves.not.toThrow()
    })

    it('doit exécuter afterLoad et alimenter le contexte', async () => {
        const result = await controller.afterLoad(mockCtx)

        expect(result).toBe(true)
        expect(controller.getCtx()).toEqual(
            expect.objectContaining({
                loaded: true,
                date: expect.any(Date)
            })
        )
    })

    it('doit exécuter beforeRender, alimenter le contexte et stopper le flux si non autorisé', async () => {
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

    it('doit exécuter afterRender et marquer la fin du rendu', async () => {
        const result = await controller.afterRender(mockCtx)

        expect(result).toBe(true)
        expect(controller.getCtx()).toEqual(
            expect.objectContaining({
                renderedAt: 'done'
            })
        )
    })

    it('doit accumuler les modifications de contexte des 3 hooks et de setDate lors du render()', async () => {
        await controller.afterLoad(mockCtx)
        await controller.beforeRender({ ...mockCtx, user: 'Bob' })
        await controller.afterRender(mockCtx)
        controller.setDate('2026-08-28')

        controller.render('dashboard', { title: 'Tableau de bord' })

        expect(viewMock.render).toHaveBeenCalledWith(
            'dashboard',
            expect.objectContaining({
                loaded: true,
                user: 'Bob',
                renderedAt: 'done',
                currentDate: '2026-08-28',
                title: 'Tableau de bord',
                date: expect.any(Date)
            })
        )
    })
})
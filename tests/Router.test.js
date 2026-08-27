// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock du fichier de routes charge par le Router
vi.mock('../src/core/routes', () => ({
    default: [
        { path: '/', name: 'home', action: 'index@HomeController' },
        { path: '/about', name: 'about', action: 'show@AboutController' },
        { path: '/user/:id', name: 'user.show', action: 'show@UserController' },
        { path: '/project-:id-:slug', name: 'project.show', action: 'view@ProjectController' }
    ]
}))

import { Router } from '../src/core/Router'

describe('Router', () => {
    let router

    beforeEach(() => {
        router = new Router()
    })

    it('doit matcher la route racine "/"', () => {
        window.history.pushState({}, '', '/')

        const match = router.getMatch()

        expect(match).not.toBeNull()
        expect(match.controller).toBe('HomeController')
        expect(match.action).toBe('index')
        expect(match.params).toEqual({})
    })

    it('doit matcher une route simple et extraire le controller et l\'action', () => {
        window.history.pushState({}, '', '/about')

        const match = router.getMatch()

        expect(match).toEqual({
            route: { path: '/about', name: 'about', action: 'show@AboutController' },
            controller: 'AboutController',
            action: 'show',
            params: {}
        })
    })

    it('doit extraire un parametre simple (:id)', () => {
        window.history.pushState({}, '', '/user/42')

        const match = router.getMatch()

        expect(match.controller).toBe('UserController')
        expect(match.action).toBe('show')
        expect(match.params).toEqual({ id: '42' })
    })

    it('doit extraire des parametres multiples separes par des tirets (:id-:slug)', () => {
        window.history.pushState({}, '', '/project-12-mon-super-projet')

        const match = router.getMatch()

        expect(match.controller).toBe('ProjectController')
        expect(match.action).toBe('view')
        expect(match.params).toEqual({
            id: '12',
            slug: 'mon-super-projet'
        })
    })

    it('doit ignorer les query parameters lors du matching', () => {
        window.history.pushState({}, '', '/about?ref=twitter&sort=asc')

        const match = router.getMatch()

        expect(match).not.toBeNull()
        expect(match.controller).toBe('AboutController')
    })

    it('doit retourner null pour une route inconnue (404)', () => {
        window.history.pushState({}, '', '/route-inexistante')

        const match = router.getMatch()

        expect(match).toBeNull()
    })
})
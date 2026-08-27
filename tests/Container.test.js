import { describe, it, expect, beforeEach } from 'vitest'
import { Container } from '../src/core/Container'

describe('Container', () => {
    let container

    beforeEach(() => {
        container = new Container()
    })

    it("doit enregistrer une factory et instancier le service", () => {
        // Ta méthode attend une fonction factory : (c) => instance
        container.set('view', () => ({ name: 'ViewService' }))

        const service = container.get('view')
        expect(service).toEqual({ name: 'ViewService' })
    })

    it("doit lever une erreur si un service n'est pas enregistre", () => {
        expect(() => {
            container.get('serviceInexistant')
        }).toThrow('Container: service "serviceInexistant" non enregistré')
    })

    it("doit écraser un service si la même clef est enregistrée deux fois", () => {
        container.set('api', () => ({ version: 1 }))
        container.set('api', () => ({ version: 2 }))

        expect(container.get('api')).toEqual({ version: 2 })
    })

    it("doit passer l'instance du container a la factory", () => {
        container.set('config', () => ({ env: 'test' }))
        container.set('app', (c) => ({
            config: c.get('config')
        }))

        const app = container.get('app')
        expect(app.config).toEqual({ env: 'test' })
    })

    it("doit indiquer correctement si un service existe avec has()", () => {
        container.set('auth', () => ({ user: null }))

        expect(container.has('auth')).toBe(true)
        expect(container.has('db')).toBe(false)
    })
})
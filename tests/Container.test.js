import { describe, it, expect, beforeEach } from 'vitest'
import { Container } from '../src/core/Container'

describe('Container', () => {
    let container

    beforeEach(() => {
        container = new Container()
    })

    it('should register a factory and instantiate the service', () => {
        // Factory signature expectation: (c) => instance
        container.set('view', () => ({ name: 'ViewService' }))

        const service = container.get('view')
        expect(service).toEqual({ name: 'ViewService' })
    })

    it('should throw an error if a requested service is not registered', () => {
        expect(() => {
            container.get('serviceInexistant')
        }).toThrow('Container: service "serviceInexistant" non enregistré')
    })

    it('should overwrite a service if the same key is registered twice', () => {
        container.set('api', () => ({ version: 1 }))
        container.set('api', () => ({ version: 2 }))

        expect(container.get('api')).toEqual({ version: 2 })
    })

    it('should pass the container instance to the factory function', () => {
        container.set('config', () => ({ env: 'test' }))
        container.set('app', (c) => ({
            config: c.get('config')
        }))

        const app = container.get('app')
        expect(app.config).toEqual({ env: 'test' })
    })

    it('should correctly report whether a service exists using has()', () => {
        container.set('auth', () => ({ user: null }))

        expect(container.has('auth')).toBe(true)
        expect(container.has('db')).toBe(false)
    })
})
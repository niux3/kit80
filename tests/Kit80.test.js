// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Explicit mock of the template engine using fluent chaining
vi.mock('@niuxe/template-engine', () => {
    return {
        TemplateEngine: vi.fn().mockImplementation(function () {
            this.use = vi.fn().mockReturnValue(this)
            this.partial = vi.fn().mockReturnValue(this)
            this.layout = vi.fn().mockReturnValue(this)
            this.helper = vi.fn().mockReturnValue(this)
            this.render = vi.fn().mockReturnValue('')
        })
    }
})

vi.mock('@niuxe/template-engine/plugins', () => ({
    PartialsPlugin: {},
    LayoutPlugin: {},
    HelpersPlugin: {},
    StrictModePlugin: {},
    I18nPlugin: {}
}))

vi.mock('../src/core/Dispatcher', () => {
    return {
        Dispatcher: vi.fn().mockImplementation(function () {
            this.run = vi.fn()
        })
    }
})

import { Kit80 } from '../src/core/Kit80'

describe('Kit80', () => {
    let app

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>'
        app = new Kit80('app')
    })

    it('should instantiate correctly and expose the container', () => {
        expect(app.container).toBeDefined()
    })

    it('should register all default services in the container', () => {
        const container = app.container

        expect(container.has('views')).toBe(true)
        expect(container.has('partials')).toBe(true)
        expect(container.has('layouts')).toBe(true)
        expect(container.has('templateEngine')).toBe(true)
        expect(container.has('view')).toBe(true)
        expect(container.has('api')).toBe(true)
    })

    it('should configure the template engine with its plugins', () => {
        const templateEngine = app.container.get('templateEngine')

        expect(templateEngine.use).toHaveBeenCalledTimes(5)
    })

    it('should instantiate container-dependent services (e.g., View)', () => {
        const viewService = app.container.get('view')
        expect(viewService).toBeDefined()
    })

    it('should invoke the Dispatcher run() method when calling app.run()', () => {
        const runSpy = vi.spyOn(app['_dispatcher'], 'run')

        const result = app.run()

        expect(runSpy).toHaveBeenCalledOnce()
        expect(result).toBe(app)
    })
})
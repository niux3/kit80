// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock explicite du moteur avec chaining fluent
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
        // On remplace vi.clearAllMocks() par un reset ciblé si besoin,
        // ou on instancie Kit80 directement après :
        app = new Kit80('app')
    })

    it("doit s'instancier correctement et exposer le container", () => {
        expect(app.container).toBeDefined()
    })

    it("doit enregistrer tous les services par defaut dans le container", () => {
        const container = app.container

        expect(container.has('views')).toBe(true)
        expect(container.has('partials')).toBe(true)
        expect(container.has('layouts')).toBe(true)
        expect(container.has('templateEngine')).toBe(true)
        expect(container.has('view')).toBe(true)
        expect(container.has('api')).toBe(true)
    })

    it("doit configurer le moteur de rendu avec ses plugins", () => {
        const templateEngine = app.container.get('templateEngine')

        expect(templateEngine.use).toHaveBeenCalledTimes(5)
    })

    it("doit instancier les services dependants du container (ex: View)", () => {
        const viewService = app.container.get('view')
        expect(viewService).toBeDefined()
    })

    it("doit appeler la methode run() du Dispatcher lors de l'appel a app.run()", () => {
        const runSpy = vi.spyOn(app['_dispatcher'], 'run')

        const result = app.run()

        expect(runSpy).toHaveBeenCalledOnce()
        expect(result).toBe(app)
    })
})
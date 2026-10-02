import { TemplateEngine } from '@niuxe/template-engine'
import {
    PartialsPlugin,
    LayoutPlugin,
    HelpersPlugin,
    StrictModePlugin,
    I18nPlugin
} from '@niuxe/template-engine/plugins'
import { Container } from './Container'
import { View } from './View'
import { Configuration } from '../Configuration'
import { Dispatcher } from './Dispatcher'
import { GlobalState } from './GlobalState'
import { ApiService } from './ApiService'


/**
 * Main application bootstrap class for Kit80 framework.
 * Handles configuration initialization, dependency injection container setup,
 * service registration, and application dispatching.
 */
export class Kit80 {
    /**
     * Creates an instance of Kit80.
     *
     * @param {string} [idSelector='app'] - The DOM element ID selector where the application mounts.
     */
    constructor(idSelector = 'app') {
        Configuration.init(idSelector)

        /** @protected @type {Container} */
        this._container = new Container()

        this._registerServices()
        this._registerComponents()

        /** @protected @type {Dispatcher} */
        this._dispatcher = new Dispatcher(Configuration, this._container)
    }

    /**
     * Registers default framework services into the dependency injection container.
     * Includes view templates, partials, layouts, template engine instance with plugins,
     * view service, and API service.
     *
     * @private
     * @returns {void}
     */
    _registerServices() {
        this._container.set('globalState', (container) => new GlobalState())

        // Chemins absolus par rapport à la racine Vite du projet client/hôte
        const views = import.meta.glob('/src/templates/views/**/*.html', { query: '?raw', import: 'default' })
        const partials = import.meta.glob('/src/templates/partials/**/*.html', { query: '?raw', import: 'default', eager: true })
        const layouts = import.meta.glob('/src/templates/layouts/**/*.html', { query: '?raw', import: 'default', eager: true })

        this._container.set('views', () => views)
        this._container.set('partials', () => partials)
        this._container.set('layouts', () => layouts)

        this._container.set('templateEngine', () => new TemplateEngine()
            .use(LayoutPlugin)
            .use(PartialsPlugin)
            .use(StrictModePlugin)
            .use(I18nPlugin)
            .use(HelpersPlugin))
        this._container.set('view', (container) => new View(container))
        this._container.set('api', (container) => new ApiService())
    }

    /**
    * import all Web Components from the `composants/` folder.
    */
    _getGlobComponents() {
        return import.meta.glob('/src/controllers/components/**/*.js', { eager: true })
    }

    /**
    * Dynamically register all Web Components from the `composants/` folder.
    */
    _registerComponents() {
        const components = this._getGlobComponents()

        for (const path in components) {
            const fileName = path.split('/').pop().replace(/\.js$/, '')
            const tagName = fileName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

            // Guard W3C : on ne charge et n'enregistre que si la balise n'est pas encore définie
            if (!customElements.get(tagName)) {
                // Avec { eager: true }, components[path] contient directement le module importé
                const module = components[path]
                const ComponentClass = module[fileName] || module.default


                if (ComponentClass) {
                    if (typeof ComponentClass.setContainer === 'function') {
                        ComponentClass.setContainer(this._container)
                    }

                    // Alternative : si la classe utilise le mixin withKit80
                    if (ComponentClass._container === undefined) {
                        ComponentClass._container = this._container
                    }
                    customElements.define(tagName, ComponentClass)
                }
            }
        }
    }

    /**
     * Starts the application dispatch process.
     *
     * @returns {this} The current Kit80 instance for method chaining.
     */
    run() {
        this._dispatcher.use('afterRender', (context) => {
            const controller = context?.controller || context?.instance
            const pageTitle = controller?.getTitle()
            const appTitle = Configuration.appTitle

            document.title = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle
        })
        this._dispatcher.run()
        return this
    }

    /**
     * Gets the application's dependency injection container.
     *
     * @readonly
     * @type {Container}
     */
    get container() {
        return this._container
    }
}
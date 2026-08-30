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
import { Configuration } from './Configuration'
import { Dispatcher } from './Dispatcher'
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
        /** @private @type {Container} */
        this._container = new Container()
        this._registerServices()
        /** @private @type {Dispatcher} */
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
        this.container.set('views', () => import.meta.glob('../templates/views/**/*.html', { query: '?raw', import: 'default' }))
        this.container.set('partials', () => import.meta.glob(
            '../templates/partials/**/*.html',
            { query: '?raw', import: 'default', eager: true }
        ))

        this.container.set('layouts', () => import.meta.glob(
            '../templates/layouts/**/*.html',
            { query: '?raw', import: 'default', eager: true }
        ))

        this.container.set('templateEngine', () => new TemplateEngine()
            .use(LayoutPlugin)
            .use(PartialsPlugin)
            .use(StrictModePlugin)
            .use(I18nPlugin)
            .use(HelpersPlugin))
        this._container.set('view', (container) => new View(container))
        this._container.set('api', (container) => new ApiService())
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
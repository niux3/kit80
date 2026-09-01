import routes from './routes.js'

/**
 * Global static configuration container for application setup, route definitions,
 * environment-dependent options, and base DOM elements.
 */
export class Configuration {
    /**
     * Flag indicating whether debug mode is enabled (true in development).
     * @type {boolean}
     */
    static debug = import.meta.env.MODE === 'development'

    /**
     * Application route definitions collection.
     * @type {Array<Object>}
     */
    static routes = routes

    /**
     * Base URL endpoint for API communications.
     * Evaluates to local server in development or environment variable in production.
     * @type {string}
     */
    static baseUrlApi = import.meta.env.MODE === 'development' ? 'http://localhost:5173/api' : import.meta.env.BASE_API_URL

    /**
     * The root DOM container element where the SPA mounts views.
     * Defaults to `null` until `Configuration.init()` is executed.
     * @type {HTMLElement|null}
     */
    static appContainer = null

    /**
     * The application title to display in the browser tab.
     * @type {string}
     */
    static appTitle = import.meta.env.TITLE || 'Kit80 - SPA Framework'

    /**
     * Resolves DOM-dependent configuration elements (specifically `appContainer`).
     * Must be called once during application bootstrap after the DOM is ready.
     *
     * @param {string} [idSelector='app'] - DOM ID of the root element (without `#`).
     * @returns {typeof Configuration} The `Configuration` class itself for chaining.
     *
     * @example
     * Configuration.init('app')
     * console.log(Configuration.appContainer) // -> HTMLElement #app
     */
    static init(idSelector = 'app') {
        Configuration.appContainer = document.getElementById(idSelector)
        return Configuration
    }
}
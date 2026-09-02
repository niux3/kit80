import { TemplateEngine } from '@niuxe/template-engine'
import { HelpersPlugin } from '@niuxe/template-engine/plugins'


/**
 * Higher-Order Component (HOC) mixin that enhances Web Components with framework capabilities:
 * access to shared global state, view routing helpers, API service, and IoC container resolution.
 *
 * @template {CustomElementConstructor} T
 * @param {T} BaseClass - The base Web Component class to extend.
 * @returns {T & CustomElementConstructor} The enhanced component class extending the base class.
 */
export const withKit80 = (BaseClass) => {
    // Avoid double-wrapping if the class has already been enhanced
    if (BaseClass._isKit80Component) {
        return BaseClass
    }

    return class Kit80Component extends BaseClass {
        /**
         * Shared Dependency Injection container static reference.
         * @protected
         * @type {Object|null}
         */
        static _container = null

        /**
         * Flag indicator to prevent duplicate HOC wrapping.
         * @protected
         * @type {boolean}
         */
        static _isKit80Component = true

        /**
         * Binds the application Dependency Injection container to the component class.
         *
         * @param {Object} container - The Dependency Injection container instance.
         */
        static setContainer(container) {
            this._container = container
        }

        /**
         * Creates an instance of Kit80Component.
         *
         * @param {...any} args - Arguments passed to the base class constructor.
         */
        constructor(...args) {
            super(...args)

            const container = this.constructor._container

            if (container) {
                /**
                 * Framework View service instance.
                 * @protected
                 * @type {Object|null}
                 */
                this._view = container.get('view')

                /**
                 * Framework API service instance.
                 * @protected
                 * @type {Object|null}
                 */
                this._api = container.get('api')

                /**
                 * Reference to the Dependency Injection container.
                 * @protected
                 * @type {Object}
                 */
                this._container = container

                /**
                 * Template engine instance configured with core helpers.
                 * @protected
                 * @type {TemplateEngine}
                 */
                this._templateEngine = this._view?.templateEngine || new TemplateEngine().use(HelpersPlugin)
            } else {
                // Fallback initialization when instantiated outside container boot sequence
                this._templateEngine = new TemplateEngine().use(HelpersPlugin)
                this._view = null
                this._api = null
                this._container = null
            }
        }

        /**
         * Updates or sets a key-value pair in the shared global state.
         *
         * @param {string} key - State key identifier.
         * @param {any} value - State value to set.
         * @returns {this} The current component instance for method chaining.
         */
        setCtx(key, value) {
            this._container?.get('globalState')?.set(key, value)
            return this
        }

        /**
         * Retrieves a specific value or the entire state object from the shared global state.
         *
         * @param {string|null} [key=null] - Optional state key identifier.
         * @returns {any} The key's value, or the full state object if no key is supplied.
         */
        getCtx(key = null) {
            return this._container?.get('globalState')?.get(key)
        }

        /**
         * Retrieves the API service instance.
         *
         * @returns {Object|null} The API service instance or null if unavailable.
         */
        getApi() {
            return this._api
        }

        /**
         * Resolves and retrieves a registered service from the IoC container.
         *
         * @param {string} name - The registered service identifier name.
         * @returns {any} The resolved service instance, or undefined if missing/unregistered.
         */
        getService(name) {
            return this._container?.get(name)
        }

        /**
         * Generates a relative path/URL for a registered named route.
         *
         * @param {string} name - Registered route name.
         * @param {Record<string, any>} [params={}] - Key-value pair parameters to hydrate in route definition.
         * @returns {string} Resolves relative URL string or fallback route path.
         */
        urlFor(name, params = {}) {
            if (this._view && typeof this._view.urlFor === 'function') {
                return this._view.urlFor(name, params)
            }
            return `/${name}`
        }

        /**
         * Renders a template string merged with shared application context and local view data.
         *
         * @param {string} template - Raw template string to evaluate.
         * @param {Record<string, any>} [ctx={}] - Local template parameters to expose during evaluation.
         * @returns {string} Evaluated HTML/string markup.
         */
        render(template, ctx = {}) {
            const mergedCtx = { ...this.getCtx(), ...ctx }
            return this._templateEngine.render(template, mergedCtx)
        }
    }
}
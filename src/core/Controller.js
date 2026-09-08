/**
 * Base Controller class providing core state management, view rendering,
 * navigation redirection, and lifecycle hooks for application pages.
 */
export class Controller {
    /**
    * Internal controller context data store.
    * @private
    * @type {Object<string, any>}
    */
    #ctx = null


    /**
    * View renderer service resolved from the container.
    * @private
    * @type {View}
    */
    #view = null

    /**
     * Creates an instance of Controller.
     *
     * @param {Container} container - Dependency injection container instance.
     */
    constructor(container) {
        this.#ctx = container?.has('globalState') ? container.get('globalState') : null
        this.#view = container.get('view')

        /**
         * API service resolved from the container.
         * @public
         * @type {ApiService}
         */
        this.api = container.get('api')

        /**
         * Page title string for browser tab document title management.
         * @protected
         * @type {string}
         */
        this._title = ''

        /**
         * clean up subscriptions
         * @protected
         * @type {Array}
         */
        // this._subscriptions = []

        this.init()
    }

    /**
     * Sets a key-value pair in the controller's internal context store.
     *
     * @param {string} key - Context property name.
     * @param {*} value - Context property value.
     * @returns {void}
     */
    setCtx(key, value) {
        if (this.#ctx) {
            this.#ctx.set(key, value)
        }
        return this
    }

    /**
     * Retrieves the controller's internal context data object.
     *
     * @returns {Object<string, any>} The current internal context object.
     */
    getCtx(key = null) {
        return this.#ctx ? this.#ctx.get(key) : null
    }

    /**
     * Sets the page document title for the current controller view context.
     *
     * @param {string} value - The page title text to assign.
     * @returns {this} The current Controller instance for method chaining.
     */
    setTitle(value) {
        this._title = value
        return this
    }

    /**
     * Gets the page document title defined for this controller instance.
     *
     * @returns {string} The current controller page title.
     */
    getTitle() {
        return this._title
    }

    /**
     * Sets multiple key-value pairs simultaneously in the controller's internal context store.
     *
     * @param {Object<string, any>} updates - Key-value pairs dictionary to update in the context.
     * @returns {this} The current Controller instance for method chaining.
     */
    setMultipleCtx(updates) {
        if (this.#ctx) {
            this.#ctx.setMultiple(updates)
        }
        return this
    }

    /**
     * Subscribes a callback function to all context store state changes.
     *
     * @param {Function} callback - Listener function invoked on any context state change.
     * @returns {Function|void} Unsubscribe function to terminate the listener subscription, or `void` if context is unavailable.
     */
    subscribeAll(callback) {
        return this.#ctx.subscribeAll(callback)
    }

    /**
     * Renders a view template using merged controller context and explicit render context.
     *
     * @param {string} template - The template name or path to render.
     * @param {Object<string, any>} [ctx={}] - Additional context properties to merge with internal context.
     * @returns {HTMLElement|string} The rendered view output (DOM element or HTML string).
     */
    render(template, ctx) {
        ctx = { ...this.getCtx(), ...ctx }
        return this.#view.render(template, ctx)
    }

    /**
     * Triggers programmatically a Client-Side Navigation redirect using a custom event.
     *
     * @param {string} url - Target URL path for redirection.
     * @returns {boolean} Always returns `false` to halt subsequent execution chains.
     */
    redirect(url) {
        window.dispatchEvent(new CustomEvent('spa:navigate', { detail: { url } }))
        return false
    }

    /**
     * Generates a URL string corresponding to a named route.
     *
     * @param {string} name - The target route name.
     * @param {Object<string, any>} [params={}] - Optional route parameter key-value pairs.
     * @returns {string} The resolved URL path.
     */
    urlFor(name, params = {}) {
        return this.#view.urlFor(name, params)
    }

    /**
     * Life-cycle initialization hook intended to be overridden by child controllers.
     * Called automatically at the end of the constructor execution.
     *
     * @ppublic
     * @returns {void}
     */
    init() {
        // override this method
    }
}
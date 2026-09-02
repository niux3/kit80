/**
 * Base Controller class providing core state management, view rendering,
 * navigation redirection, and lifecycle hooks for application pages.
 */
export class Controller {
    /**
     * Creates an instance of Controller.
     *
     * @param {Container} container - Dependency injection container instance.
     */
    constructor(container) {
        /**
         * Internal controller context data store.
         * @protected
         * @type {Object<string, any>}
         */
        this._ctx = container?.has('globalState') ? container.get('globalState') : null

        /**
         * View renderer service resolved from the container.
         * @protected
         * @type {View}
         */
        this._view = container.get('view')

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
    }

    /**
     * Sets a key-value pair in the controller's internal context store.
     *
     * @param {string} key - Context property name.
     * @param {*} value - Context property value.
     * @returns {void}
     */
    setCtx(key, value) {
        if (this._ctx) {
            this._ctx.set(key, value)
        }
        return this
    }

    /**
     * Retrieves the controller's internal context data object.
     *
     * @returns {Object<string, any>} The current internal context object.
     */
    getCtx(key = null) {
        return this._ctx ? this._ctx.get(key) : null
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
     * Renders a view template using merged controller context and explicit render context.
     *
     * @param {string} template - The template name or path to render.
     * @param {Object<string, any>} [ctx={}] - Additional context properties to merge with internal context.
     * @returns {HTMLElement|string} The rendered view output (DOM element or HTML string).
     */
    render(template, ctx) {
        ctx = { ...this.getCtx(), ...ctx }
        return this._view.render(template, ctx)
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
        return this._view.urlFor(name, params)
    }
}
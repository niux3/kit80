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
         * @private
         * @type {Object<string, any>}
         */
        this._ctx = {}

        /**
         * View renderer service resolved from the container.
         * @private
         * @type {View}
         */
        this._view = container.get('view')
    }

    /**
     * Sets a key-value pair in the controller's internal context store.
     *
     * @param {string} key - Context property name.
     * @param {*} value - Context property value.
     * @returns {void}
     */
    setCtx(key, value) {
        this._ctx[key] = value
    }

    /**
     * Retrieves the controller's internal context data object.
     *
     * @returns {Object<string, any>} The current internal context object.
     */
    getCtx() {
        return this._ctx
    }

    /**
     * Renders a view template using merged controller context and explicit render context.
     *
     * @param {string} template - The template name or path to render.
     * @param {Object<string, any>} [ctx={}] - Additional context properties to merge with internal context.
     * @returns {HTMLElement|string} The rendered view output (DOM element or HTML string).
     */
    render(template, ctx) {
        ctx = { ...this._ctx, ...ctx }
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
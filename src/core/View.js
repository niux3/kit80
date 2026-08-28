import { Configuration } from './Configuration'


/**
 * View engine abstraction class.
 * Handles template loading, partials/layouts registration, helper bindings, and route URL generation.
 */
export class View {
    /**
     * Creates an instance of View.
     *
     * @param {Container} container - Dependency injection container instance.
     */
    constructor(container) {
        /** @type {Array<Object>} */
        this.routes = Configuration.routes

        /** @type {TemplateEngine} */
        this.templateEngine = container.get('templateEngine')

        /** @type {Object<string, () => Promise<string>>} */
        this.views = container.get('views')

        this._registerPartials(container.get('partials'))
        this._registerLayouts(container.get('layouts'))

        this.templateEngine.helper('urlFor', this.urlFor.bind(this))
    }

    /**
     * Asynchronously loads and renders a view template with context variables.
     *
     * @async
     * @param {string} template - View template path name (without extension).
     * @param {Object<string, any>} [ctx={}] - Context variables available during rendering.
     * @returns {Promise<string|HTMLElement>} Rendered HTML content or element.
     */
    async render(template, ctx = {}) {
        const templateContent = await this._loadViews(template)
        return this.templateEngine.render(templateContent, ctx)
    }

    /**
     * Internal helper to retrieve template content loader function by path.
     *
     * @private
     * @async
     * @param {string} template - View template identifier.
     * @returns {Promise<string>} Raw HTML string content of the template.
     * @throws {Error} Throws if target view template is not registered.
     */
    async _loadViews(template) {
        const path = `../templates/views/${template}.html`
        const loader = this.views[path]
        if (!loader) {
            throw new Error(`Template "${template}" introuvable (${path})`)
        }
        return loader()
    }

    /**
     * Parses and registers partial components into the template engine.
     *
     * @private
     * @param {Object<string, string>} partials - Object mapping file paths to HTML contents.
     * @returns {void}
     */
    _registerPartials(partials) {
        for (const [path, content] of Object.entries(partials)) {
            const name = path.match(/([^/]+)\.html$/)[1]
            if (!name) {
                throw new Error(`partials "${name}" introuvable (${path})`)
            }
            this.templateEngine.partial(name, content)
        }
    }

    /**
     * Parses and registers layout templates into the template engine.
     *
     * @private
     * @param {Object<string, string>} layouts - Object mapping file paths to HTML contents.
     * @returns {void}
     */
    _registerLayouts(layouts) {
        for (const [path, content] of Object.entries(layouts)) {
            const name = path.match(/([^/]+)\.html$/)[1]
            if (!name) {
                throw new Error(`layouts "${name}" introuvable (${path})`)
            }
            this.templateEngine.layout(name, content)
        }
    }

    /**
     * Generates a relative path URL for a named route with parameter replacement.
     *
     * @param {string} name - The target registered route name.
     * @param {Object<string, string|number>} [params={}] - Parameters to bind into route path.
     * @returns {string} Interpolated URL path string.
     * @throws {Error} Throws if route name is invalid or a required path parameter is omitted.
     */
    urlFor(name, params = {}) {
        const route = this.routes.find(r => r.name === name)
        if (!route) throw new Error(`Route "${name}" introuvable`)

        const path = route.path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
            if (!(key in params)) {
                throw new Error(`Paramètre "${key}" manquant pour la route "${name}"`)
            }
            return params[key]
        })

        return path
    }
}
import routes from '../routes'


/**
 * Route matching service responsible for mapping the current browser URL path
 * to registered route definitions and extracting path parameters.
 */
export class Router {
    /**
     * Array of route objects augmented with compiled RegExp match patterns.
     * @private
     * @type {Array<Object>}
     */
    #routes = null

    /**
     * Creates an instance of Router and pre-compiles route URL patterns.
     */
    constructor() {
        // Pré-compilation des regex à l'initialisation du Router
        this.#routes = routes.map(route => ({
            ...route,
            compiledRegex: this.#compileRoutePattern(route)
        }))
    }

    /**
     * Compiles a route path pattern into a regular expression using named capturing groups
     * and optional regex constraints defined in route parameter configurations.
     *
     * @private
     * @param {Object} route - Route definition containing path and optional parameter constraints.
     * @param {string} route.path - URL path pattern (e.g., "/:lang/about").
     * @param {Object<string, RegExp>} [route.params] - Optional map of route parameter regex constraints.
     * @returns {RegExp} Compiled case-insensitive regular expression with named capturing groups.
     */
    #compileRoutePattern(route) {
        let pattern = route.path
            .replace(/:([a-zA-Z0-9_]+)(?=-)/g, (match, param) => {
                const constraint = route.params?.[param]?.source ?? '[^/-]+'
                return `(?<${param}>${constraint})`
            })
            .replace(/:([a-zA-Z0-9_]+)/g, (match, param) => {
                const constraint = route.params?.[param]?.source ?? '[^/]+'
                return `(?<${param}>${constraint})`
            })

        return new RegExp(`^${pattern}$`, 'i')
    }

    /**
     * Matches the current `window.location.pathname` against pre-compiled routes.
     *
     * @returns {RouteMatch|null} Match result containing controller, action, route object, and parameters, or `null` if no route matches.
     */
    getMatch() {
        const rawPath = window.location.pathname.split('?')[0]

        for (const route of this.#routes) {
            const match = rawPath.match(route.compiledRegex)
            if (match) {
                const [action, controller] = route.action.split('@')
                return {
                    route,
                    controller,
                    action,
                    params: match.groups ?? {}
                }
            }
        }
        return null
    }
}
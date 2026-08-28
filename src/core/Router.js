import routes from './routes'


/**
 * Route matching service responsible for mapping the current browser URL path
 * to registered route definitions and extracting path parameters.
 */
export class Router {
    /**
     * Creates an instance of Router.
     * Initializes the route collection from the application route definitions.
     */
    constructor() {
        /** @private @type {Array<Object>} */
        this._routes = routes
    }

    /**
     * Matches the current URL pathname against registered routes.
     * Converts route parameters into named regular expression capture groups.
     *
     * @returns {{ route: Object, controller: string, action: string, params: Object<string, string> } | null}
     * Object containing the route definition, resolved controller name, action method, and extracted route parameters, or null if no match is found.
     */
    getMatch() {
        // Ex: '/about' ou '/project-12-mon-projet' (sans query params)
        const rawPath = window.location.pathname.split('?')[0]

        for (const route of this._routes) {
            let pattern = route.path
                .replace(/:([a-zA-Z0-9_]+)(?=-)/g, '(?<$1>[^/-]+)')
                .replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)')

            const regex = new RegExp(`^${pattern}$`, 'i')
            const match = rawPath.match(regex)

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
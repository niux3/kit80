import routes from './routes'

export class Router {
    constructor() {
        this._routes = routes
    }

    /**
     * Extrait proprement la route et gère l'ancre interne.
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
import routes from './routes'

export class Router {
    constructor() {
        this._routes = routes
    }

    /**
     * Extrait proprement la route et gère l'ancre interne.
     * @param {string} method - filtre sémantique, 'GET' par défaut (seul verbe déclenché pour l'instant)
     */
    getMatch(method = 'GET') {
        const hash = window.location.hash || '#/'
        // On sépare la route de l'éventuelle ancre (ex: #/project/1#specs)
        const [rawPath, anchor] = hash.substring(1).split('#')
        const path = rawPath || '/'

        for (const route of this._routes) {
            if ((route.method ?? 'GET') !== method) continue

            const matches = path.match(route.re)
            if (matches) {
                const [action, controller] = route.action.split('@')
                return {
                    controller,
                    action,
                    params: matches.groups ?? {},
                    anchor: anchor || null
                }
            }
        }
        return null
    }
}
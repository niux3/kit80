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

        // On extrait le path en nettoyant les paramètres de requête (?) et les ancres (#)
        const rawPath = hash.substring(1).split('#')[0].split('?')[0]

        for (const route of this._routes) {
            // 1. Vérification de la méthode HTTP
            if ((route.method ?? 'GET').toUpperCase() !== method.toUpperCase()) continue

            // 2. Transformer le pattern de route en RegExp
            // On remplace d'abord les paires spécifiques comme :id-:slug
            let pattern = route.path
                // Si un paramètre est suivi d'un tiret (ex: :id-), il ne doit pas capturer le tiret
                .replace(/:([a-zA-Z0-9_]+)(?=-)/g, '(?<$1>[^/-]+)')
                // Pour tous les autres paramètres (ex: :slug), on capture tout jusqu'au prochain / ou fin de chaîne
                .replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)')

            const regex = new RegExp(`^${pattern}$`, 'i')

            // 3. Test du path
            const match = rawPath.match(regex)

            if (match) {
                const [action, controller] = route.action.split('@')

                return {
                    route,
                    controller,
                    action,
                    // match.groups contiendra : { id: "1", slug: "un-slug" }
                    params: match.groups ?? {}
                }
            }
        }

        return null
    }
}
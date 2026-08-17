import routes from './routes.js'

export class Configuration {
    static debug = import.meta.env.MODE === 'development'
    static routes = routes
    static baseUrlApi = import.meta.env.MODE === 'development' ? 'http://localhost:3000/api' : import.meta.env.VITE_API_URL
    static appContainer = null

    /**
    * Résout les éléments de configuration qui dépendent du DOM (actuellement `appContainer`).
    * Doit être appelée une seule fois, après que le DOM soit prêt (ex: dans `App`, au bootstrap).
    *
    * Tant que `init()` n'a pas été appelée, `Configuration.appContainer` vaut `null`.
    * Un appel ultérieur écrase l'état précédent (Configuration est un singleton global).
    *
    * @param {string} [idSelector='app'] - id de l'élément DOM racine de l'application (sans le '#')
    * @returns {typeof Configuration} La classe Configuration elle-même, pour un éventuel chaînage
    *
    * @example
    * // Dans App, au bootstrap, une fois le DOM prêt
    * Configuration.init('app')
    * Configuration.appContainer // -> l'élément DOM résolu
    */
    static init(idSelector = 'app') {
        Configuration.appContainer = document.getElementById(idSelector)
        return Configuration
    }
}
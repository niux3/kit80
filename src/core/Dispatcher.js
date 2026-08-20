// core/Dispatcher.js
import { Router } from './Router'

export class Dispatcher {
    constructor(configuration) {
        this.router = new Router()
        this.activePage = null
        this.configuration = configuration
        this.appContainer = configuration.appContainer
    }

    run() {
        // 1. Charger la vue initiale
        window.addEventListener('DOMContentLoaded', () => this._dispatch())

        // 2. Gérer les boutons Précédent / Suivant du navigateur
        window.addEventListener('popstate', () => this._dispatch())

        // 3. Intercepter globalement tous les clics sur les liens <a> internes
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a')

            // On vérifie que c'est un lien interne (même origine)
            if (link && link.origin === window.location.origin && !link.hasAttribute('data-native')) {
                e.preventDefault()
                this.navigateTo(link.getAttribute('href'))
            }
        })
    }

    navigateTo(path) {
        // Modifie l'URL sans rechargement
        window.history.pushState({}, '', path)
        // Déclenche le rendu de la nouvelle vue
        this._dispatch()
    }

    async _dispatch() {
        try {
            const route = this.router.getMatch()
            if (!route) return await this._errors(new Error('404'))

            this._cleanup()

            const instance = await this._resolveController(route.controller)
            const view = await instance[route.action](...Object.values(route.params))

            this._render(view)
            this.activePage = instance
            if (route.anchor) this._scrollToAnchor(route.anchor)

        } catch (e) {
            await this._errors(e)
        }
    }

    async _resolveController(name) {
        const module = await import(`../controller/${name}.js`)
        const ControllerClass = module.default
        return new ControllerClass()
    }

    _render(view) {
        if (view instanceof HTMLElement) {
            this.appContainer.replaceChildren(view)
        } else {
            this.appContainer.innerHTML = view
        }
    }

    _cleanup() {
        if (this.activePage && typeof this.activePage.destroy === 'function') {
            this.activePage.destroy()
        }
        this.appContainer.innerHTML = ''
        this.activePage = null
    }

    async _errors(e) {
        if (this.configuration.debug) {
            console.error("Critical Error: Erreur de chargement", e.message)
        }
        try {
            const instance = await this._resolveController('ErrorsController')
            const view = await instance.error(e.message)
            this._render(view)
        } catch (fallbackError) {
            // Le contrôleur d'erreur lui-même a échoué (fichier manquant, etc.)
            // — dernier filet, sans dépendance à quoi que ce soit d'autre.
            if (this.configuration.debug) {
                this.appContainer.innerHTML = `<h1>Erreur de chargement</h1><p>${e.message}</p>`
            } else {
                const instance = await this._resolveController('ErrorsController')
                const view = await instance.error('500')
                this._render(view)
            }
        }
    }

    _scrollToAnchor(id) {
        requestAnimationFrame(() => {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        })
    }
}
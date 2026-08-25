// core/Dispatcher.js
import { Router } from './Router'

export class Dispatcher {
    constructor(configuration, container) {
        this.router = new Router()
        this.activePage = null
        this._container = container
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
            if (!link) return

            const href = link.getAttribute('href') || ''

            // 1. Gestion des ancres locales simples (ex: href="#lee")
            if (href.startsWith('#')) {
                // On laisse le comportement natif du navigateur pour défiler vers l'élément
                // OU on gère le smooth scroll si l'élément existe dans le DOM
                const targetEl = document.getElementById(href.substring(1))
                if (targetEl) {
                    e.preventDefault()
                    targetEl.scrollIntoView({ behavior: 'smooth' })
                    window.history.pushState(null, '', href)
                }
                return // On stoppe ici : ce n'est PAS un changement de page/route SPA
            }

            // 2. Le reste de ton intercepteur SPA classique pour les vraies pages (/about, /project/1)
            const isSameOrigin = link.origin === window.location.origin
            const isTargetSelf = !link.target || link.target === '_self'
            const isStandardClick = e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey

            if (isSameOrigin && isTargetSelf && isStandardClick && !link.hasAttribute('data-native')) {
                e.preventDefault()
                this.navigateTo(link.pathname + link.search + link.hash)
            }
        })

        document.addEventListener('submit', (e) => {
            const form = e.target.closest('form')
            if (!form) return

            e.preventDefault()

            const action = form.getAttribute('action') || window.location.pathname
            const method = (form.method || 'GET').toUpperCase()
            const formData = new FormData(form)

            this.navigateTo(action, {
                method: method,
                body: formData
            })
        })
    }

    navigateTo(path, options = {}) {
        // Modifie l'URL sans rechargement
        window.history.pushState({}, '', path)
        // Déclenche le rendu de la nouvelle vue
        this._dispatch(options)
    }

    async _dispatch(options = {}) {
        try {
            const route = this.router.getMatch()
            if (!route) return await this._errors(new Error('404'))

            const instance = await this._resolveController(route.controller)

            // request centralise tout proprement :
            const request = {
                params: route.params ?? {},
                method: options.method || route.method || 'GET',
                body: options.body || null,
                query: Object.fromEntries(new URLSearchParams(window.location.search))
            }

            const view = await instance[route.action](request);

            this._cleanup()
            this._render(view)
            this.activePage = instance
        } catch (e) {
            await this._errors(e)
        }
    }

    async _resolveController(name) {
        const module = await import(`../controller/${name}.js`)
        const ControllerClass = module.default
        return new ControllerClass(this._container)
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
}
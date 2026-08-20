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
            console.log('form', form)
            if (!form) return

            e.preventDefault()
            const formData = new FormData(form)
            this.navigateTo(formData.get('action'))
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

            const instance = await this._resolveController(route.controller)
            const view = await instance[route.action](...Object.values(route.params))

            this._cleanup()

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
// core/ComponentMixin.js
import { TemplateEngine } from '@niuxe/template-engine'
import { HelpersPlugin } from '@niuxe/template-engine/plugins'

/**
 * Mixin pour les Web Components qui leur donne accès à :
 * - ctx (le contexte du contrôleur parent)
 * - view (avec helpers et urlFor)
 * - api (service API)
 * - container (le conteneur DI)
 */
export const withKit80 = (BaseClass) => {
    // Si la classe a déjà été wrappée, ne pas le faire deux fois
    if (BaseClass.prototype._isKit80Component) {
        return BaseClass
    }

    return class Kit80Component extends BaseClass {
        static _container = null
        static _isKit80Component = true // Marqueur pour éviter double wrapping

        static setContainer(container) {
            this._container = container
        }

        constructor(...args) {
            super(...args)

            // Récupérer le container
            const container = this.constructor._container

            if (container) {
                // Services du framework
                this._view = container.get('view')
                this._api = container.get('api')
                this._container = container

                // Template engine avec helpers
                this._templateEngine = this._view?.templateEngine || new TemplateEngine().use(HelpersPlugin)
            } else {
                // Fallback si pas de container
                this._templateEngine = new TemplateEngine().use(HelpersPlugin)
                this._view = null
                this._api = null
                this._container = null
            }
        }

        /**
         * Méthode pour mettre à jour le contexte
         */
        setCtx(key, value) {
            this._container.get('globalState').set(key, value)
            return this
        }

        /**
         * Récupère une valeur du contexte
         */
        getCtx(key = null) {
            return this._container.get('globalState').get(key)
        }

        /**
         * Récupère un service du container
         */
        getService(name) {
            return this._container?.get(name)
        }

        /**
         * Génère une URL pour une route nommée
         */
        urlFor(name, params = {}) {
            if (this._view && typeof this._view.urlFor === 'function') {
                return this._view.urlFor(name, params)
            }
            // Fallback
            return `/${name}`
        }

        /**
         * Rendu avec le template engine du framework
         */
        render(template, ctx = {}) {
            const mergedCtx = { ...this.getCtx(), ...ctx }
            return this._templateEngine.render(template, mergedCtx)
        }
    }
}
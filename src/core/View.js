import { Configuration } from './Configuration'


export class View {
    constructor(container) {
        this.routes = Configuration.routes

        this.templateEngine = container.get('templateEngine')
        this.views = container.get('views')

        this._registerPartials(container.get('partials'))
        this._registerLayouts(container.get('layouts'))

        this.templateEngine.helper('urlFor', this.urlFor.bind(this))
    }

    async render(template, ctx = {}) {
        const templateContent = await this._loadViews(template)
        // console.log(this.templateEngine.render(templateContent, ctx))
        return this.templateEngine.render(templateContent, ctx)
    }

    async _loadViews(template) {
        const path = `../templates/views/${template}.html`
        const loader = this.views[path]
        if (!loader) {
            throw new Error(`Template "${template}" introuvable (${path})`)
        }
        return loader()
    }

    _registerPartials(partials) {
        for (const [path, content] of Object.entries(partials)) {
            const name = path.match(/([^/]+)\.html$/)[1]
            if (!name) {
                throw new Error(`partials "${name}" introuvable (${path})`)
            }
            this.templateEngine.partial(name, content)
        }
    }

    _registerLayouts(layouts) {
        for (const [path, content] of Object.entries(layouts)) {
            const name = path.match(/([^/]+)\.html$/)[1]
            if (!name) {
                throw new Error(`layouts "${name}" introuvable (${path})`)
            }
            this.templateEngine.layout(name, content)
        }
    }

    urlFor(name, params = {}) {
        const route = this.routes.find(r => r.name === name)
        if (!route) throw new Error(`Route "${name}" introuvable`)

        // On remplace les paramètres :key par leurs valeurs transmises dans params
        const path = route.path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
            if (!(key in params)) {
                throw new Error(`Paramètre "${key}" manquant pour la route "${name}"`)
            }
            return params[key]
        })

        return `#${path}`
    }
}
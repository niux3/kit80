import { Configuration } from './Configuration'


export class View {
    constructor(container) {
        this.templateEngine = container.get('templateEngine')
        this.templates = container.get('templates')
        this.routes = Configuration.routes
        this.templateEngine.helper('urlFor', this._urlFor.bind(this))
    }

    async render(template, ctx = {}) {
        const templateContent = await this._loadTemplate(template)
        console.log(this.templateEngine.render(templateContent, ctx))
        return this.templateEngine.render(templateContent, ctx)
    }

    async _loadTemplate(template) {
        const path = `../views/${template}.html`
        const loader = this.templates[path]
        if (!loader) {
            throw new Error(`Template "${template}" introuvable (${path})`)
        }
        return loader()
    }

    _urlFor(name, params = {}) {
        const route = this.routes.find(r => r.name === name)
        if (!route) throw new Error(`Route "${name}" introuvable`)

        if (Object.keys(params).length === 0) return `#${route.path}`

        const path = route.path.replace(/:(\w+)/g, (_, key) => {
            if (!(key in params)) throw new Error(`Paramètre "${key}" manquant pour la route "${name}"`)
            return params[key]
        })
        console.log('path', path)

        return `#${path}`
    }


}
// View.js
export class View {
    constructor(container) {
        this.templateEngine = container.get('templateEngine')
        this.templates = container.get('templates')
    }

    async render(template, ctx = {}) {
        const templateContent = await this._loadTemplate(template)
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
}
export class Controller {
    constructor(container) {
        this._ctx = {}
        this._view = container.get('view')
    }

    async load() {
        // return this.container.get('api')
    }

    async destroy() {
        // do nothing
    }

    setCtx(key, value) {
        this._ctx[key] = value
    }

    getCtx() {
        return this._ctx
    }

    render(template, ctx) {
        ctx = { ...this._ctx, ...ctx }
        return this._view.render(template, ctx)
    }

    redirect(url) {
        window.dispatchEvent(new CustomEvent('spa:navigate', { detail: { url } }))
        return false
    }

    urlFor(name) {
        return this._view.urlFor(name)
    }
}
import kit80 from '../main'


export class Controller {
    constructor() {
        this._ctx = {}
        this._view = kit80.container.get('view')
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
        window.location.href = url
        return ''
    }
}
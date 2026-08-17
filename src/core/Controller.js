import kit80 from '../main'


export class Controller {
    constructor() {
        this._view = kit80.container.get('view')
    }

    async load() {
        // return this.container.get('api')
    }

    async destroy() {
        // do nothing
    }

    render(template, ctx) {
        return this._view.render(template, ctx)
    }

    redirect(url) {
        window.location.href = url
        return ''
    }
}
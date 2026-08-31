import { Controller } from '../core/Controller'


export class AppController extends Controller {
    constructor(container) {
        super(container)
        this._languages = ['fr', 'en']
    }

    async afterLoad(ctx) {
        console.log('afterLoad')
    }

    async beforeRender(ctx) {
        console.log('beforeRender', ctx)
        this.setCtx('currentPath', window.location.pathname)
        this.setCtx('currentLanguage', 'en')
        this.setCtx('currentRouteName', ctx.route.route.name)
        this.setCtx('currentUrlsLanguages', this.#getCurrentUrlsLanguages())
    }

    async afterRender(ctx) {
        console.log('afterRender')
    }

    #getCurrentUrlsLanguages() {
        let output = []
        for (const lang of this._languages) {
            output.push({ url: this.urlFor(this.getCtx('currentRouteName'), { lang: lang }), lang: lang })
        }
        return output
    }
}
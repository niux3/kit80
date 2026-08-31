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
        console.log('beforeRender')
        this.setCtx('currentPath', window.location.pathname)
        this.setCtx('currentLanguage', localStorage.getItem('lang') || 'en')
        this.setCtx('currentRouteName', ctx.route.route.name)
        this.setCtx('currentUrlsLanguages', this.#getCurrentUrlsLanguages())

        this.setCtx('menu', {
            "fr": {
                "home": "Accueil",
                "about": "À propos"
            },
            "en": {
                "home": "Home",
                "about": "About"
            }
        })
    }

    async afterRender(ctx) {
        console.log('afterRender')
        document.querySelector('html').setAttribute('lang', this.getCtx('currentLanguage'))
    }

    #getCurrentUrlsLanguages() {
        let output = []
        for (const lang of this._languages) {
            output.push({ url: this.urlFor(this.getCtx('currentRouteName'), { lang: lang }), lang: lang })
        }
        return output
    }
}
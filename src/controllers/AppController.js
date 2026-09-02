import { Controller } from '../core/Controller'


export class AppController extends Controller {
    constructor(options) {
        super(options)

        window.addEventListener('ui_selector:select', e => {
            if (e.detail?.value) {
                this.#setCurrentLanguage(e.detail.value)
            }
        })
    }

    async afterLoad(ctx) {
        console.log('afterLoad')
    }

    async beforeRender(ctx) {
        console.log('beforeRender')

        const lang = this.#setCurrentLanguage(
            ctx?.params?.lang || localStorage.getItem('lang') || 'en'
        )

        this.setCtx('currentPath', window.location.pathname)
        this.setCtx('languages', ['fr', 'en'])
        this.setCtx('currentLanguage', lang)
        this.setCtx('currentRouteName', ctx?.route?.route?.name)

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
    }

    #setCurrentLanguage(lang) {
        localStorage.setItem('lang', lang)
        document.documentElement.setAttribute('lang', lang)
        return lang
    }
}
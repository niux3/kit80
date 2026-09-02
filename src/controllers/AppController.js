import { Controller } from '../core/Controller'


export class AppController extends Controller {
    async afterLoad(ctx) {
        console.log('afterLoad')
    }

    async beforeRender(ctx) {
        console.log('beforeRender')
        this.setCtx('currentPath', window.location.pathname)

        this.setCtx('currentLanguage', localStorage.getItem('lang') || 'en')
        this.setCtx('currentRouteName', ctx.route.route.name)

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
}
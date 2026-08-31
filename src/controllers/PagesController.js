import { AppController } from './AppController'


export default class PagesController extends AppController {
    async home(req) {
        this.setTitle('Accueil')

        const lang = req.params.lang || this.getCtx('currentLanguage')
        const data = await this.api.get('/home.json')

        return this.render('pages/home', data[lang])
    }

    async about(req) {
        this.setTitle('À propos')

        const lang = req.params.lang
        const data = await this.api.get('/about.json')

        return this.render('pages/about', data[lang])
    }
}
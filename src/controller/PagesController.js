import { AppController } from './AppController'


export default class PagesController extends AppController {
    async home() {
        return this.render('pages/home')
    }

    async about() {
        return this.render('pages/about')
    }

    async contact(req) {
        let ctx = {
            name: req.body !== null ? req.body.get('name') : 'Chuck Norris'
        }
        return this.render('pages/contact', ctx)
    }

    async adminHome(req) {
        console.log('admin home')
        return 'admin home'
    }
}
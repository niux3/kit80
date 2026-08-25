import { AppController } from './AppController'


export default class PagesController extends AppController {
    home() {
        return this.render('pages/home')
    }

    about() {
        return this.render('pages/about')
    }

    contact(req) {
        let ctx = {
            name: req.body !== null ? req.body.get('name') : 'Chuck Norris'
        }
        return this.render('pages/contact', ctx)
    }
}
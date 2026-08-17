import { Controller } from '../core/Controller'


export default class PagesController extends Controller {
    constructor() {
        super()
    }

    home() {
        return this.render('pages/home')
    }

    about() {
        return this.render('pages/about')
    }


    contact() {
        return this.render('pages/contact')
    }
}
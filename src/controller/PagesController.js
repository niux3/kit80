import { AppController } from './AppController'


export default class PagesController extends AppController {
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

    contactSubmit(formData) {
        console.log('submit >>', formData)
        return this.render('pages/contact')
    }
}
import { Controller } from '../core/Controller'


export default class PagesController extends Controller {
    constructor() {
        super()
    }

    home() {
        return this.render('pages/home')
    }

    about() {
        return `
            ${this.nav}
            <h1>à propos de nous</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime illum, autem dignissimos. Est saepe consectetur itaque repellendus ab eum eveniet modi temporibus, minima maiores, veniam optio doloremque. Possimus dolore, iure.</p>
        `;
    }


    contact() {
        return `
            ${this.nav}
            <h1>contact</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime illum, autem dignissimos. Est saepe consectetur itaque repellendus ab eum eveniet modi temporibus, minima maiores, veniam optio doloremque. Possimus dolore, iure.</p>
        `;
    }
}
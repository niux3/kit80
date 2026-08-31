import { AppController } from './AppController'


export default class PagesController extends AppController {
    async index(req) {
        return this.redirect(this.urlFor('home', { lang: 'fr' }))
    }

    async home(req) {
        console.log(req.params)
        this.setTitle('Accueil')
        const ctx = {
            lang: 'de',
            title: "Bienvenue",
            features: [
                { label: 'IoC Container', status: 'Ready' },
                { label: 'Router & Dispatcher', status: 'Active' },
                { label: 'Native Web Components', status: 'Loaded' }
            ]
        }

        return this.render('pages/home', ctx)
    }

    async about(req) {
        this.setTitle('À propos')
        const ctx = {
            title: "Spécifications",
            description: "kit80 est un framework SPA ultra-léger conçu autour des standards natifs W3C, de l'injection de dépendances et des Web Components (sans un Virtual DOM).",
            specs: [
                { name: 'Architecture', value: 'IoC / Dispatcher / Pipeline' },
                { name: 'Virtual DOM', value: 'Aucun (DOM Natif)' },
                { name: 'UI Interactivity', value: 'Custom Elements (v1)' },
                { name: 'Templating Engine', value: '@niuxe/template-engine' },
                { name: 'Test Suite', value: 'Vitest + Happy DOM' }
            ]
        }

        return this.render('pages/about', ctx)
    }
}
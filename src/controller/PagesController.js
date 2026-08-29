import { AppController } from './AppController'


export default class PagesController extends AppController {
    async home() {
        const ctx = {
            title: 'Welcome to kit80',
            features: [
                { label: 'IoC Container', status: 'Ready' },
                { label: 'Router & Dispatcher', status: 'Active' },
                { label: 'Native Web Components', status: 'Loaded' }
            ]
        }

        return this.render('pages/home', ctx)
    }

    async about() {
        const ctx = {
            title: 'Spécifications kit80',
            description: "kit80 est un framework SPA ultra-léger conçu autour des standards natifs W3C, de l'injection de dépendances et des Web Components (sans la lourdeur d'un Virtual DOM).",
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
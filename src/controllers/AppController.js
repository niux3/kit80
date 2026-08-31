import { Controller } from '../core/Controller'


export class AppController extends Controller {
    constructor(container) {
        super(container)
    }

    async afterLoad(ctx) {
        console.log('afterLoad')
    }

    async beforeRender(ctx) {
        console.log('beforeRender')
        this.setCtx('currentPath', window.location.pathname)
    }

    async afterRender(ctx) {
        console.log('afterRender')
    }
}
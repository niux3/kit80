import { Controller } from '../core/Controller'


export class AppController extends Controller {
    constructor(container) {
        super(container)
        this._ctxDate()
    }

    _ctxDate() {
        this.setCtx('date', new Date())
    }

    async afterLoad(ctx) {
        console.log('afterLoad', ctx.route.route.name)
        const condition = false
        if (!condition && ctx.route.route.name.startsWith('admin')) {
            this.redirect(this.urlFor('home'))
        }
    }

    async beforeRender(ctx) {
        console.log('beforeRender', ctx.route.route.name)
    }

    async afterRender(ctx) {
        console.log('afterRender', ctx.route.route.name)
    }
}
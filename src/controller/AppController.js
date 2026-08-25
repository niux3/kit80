import { Controller } from '../core/Controller'


export class AppController extends Controller {
    constructor(container) {
        super(container)
        this._ctxDate()
    }

    _ctxDate() {
        this.setCtx('date', new Date())
    }
}
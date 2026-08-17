import { Controller } from '../core/Controller'


export default class ErrorsController extends Controller {
    constructor() {
        super()
    }

    error(status) {
        return this.render(`errors/${status}`)
    }
}
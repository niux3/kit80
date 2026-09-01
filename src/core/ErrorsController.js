import { Controller } from './Controller'


export default class ErrorsController extends Controller {
    error(status) {
        return this.render(`errors/${status}`)
    }
}
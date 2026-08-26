import { AppController } from '../core/Controller'


export default class ErrorsController extends AppController {
    error(status) {
        return this.render(`errors/${status}`)
    }
}
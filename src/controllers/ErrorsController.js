import { AppController } from './AppController'


export default class ErrorsController extends AppController {
    error(status) {
        return this.render(`errors/${status}`)
    }
}
import { AppController } from './AppController'


export default class ProjectsController extends AppController {

    constructor() {
        super()
    }

    async project(id, slug) {
        // const project = await this.api.getProject(id)
        // console.log(project)
        return this.render('projects/project', { id, slug })
    }
}
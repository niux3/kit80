import { Controller } from '../core/Controller'


export default class ProjectsController extends Controller {

    constructor() {
        super()
    }

    async project(id, slug) {
        // const project = await this.api.getProject(id)
        // console.log(project)
        return this.render('projects/project', { id, slug })
    }
}
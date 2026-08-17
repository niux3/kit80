import { Controller } from '../core/Controller'


export default class ProjectsController extends Controller {

    constructor() {
        super()
    }

    async project_view(id, slug) {
        // const project = await this.api.getProject(id)
        // console.log(project)
        console.log(id, slug)
        return this.render('projects/project', { id, slug })
    }
}
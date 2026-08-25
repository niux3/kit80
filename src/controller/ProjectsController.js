import { AppController } from './AppController'


export default class ProjectsController extends AppController {
    async project(req) {
        // const project = await this.api.getProject(id)
        const { id, slug } = req.params
        return this.render('projects/project', { id, slug })
    }
}
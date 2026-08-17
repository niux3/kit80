import { Controller } from '../core/Controller'


export default class ProjectsController extends Controller {

    constructor() {
        super()
    }

    async project(id, slug) {
        // const project = await this.api.getProject(id)
        // console.log(project)
        return `
            ${this.nav}
            <h1>${id} - ${slug}</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime illum, autem dignissimos. Est saepe consectetur itaque repellendus ab eum eveniet modi temporibus, minima maiores, veniam optio doloremque. Possimus dolore, iure.</p>
        `;
    }
}
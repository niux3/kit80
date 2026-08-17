import kit80 from '../main'


export class Controller {
    constructor() {
        this.nav = `
            <nav>
                <a href="#/">accueil</a>
                <a href="#/about">à propos de nous</a>
                <a href="#/contact">contact</a>
                <a href="#/project-1-hello-world">projet 1</a>
            </nav>
        `
        this._view = kit80.container.get('view')

    }

    async load() {
        // return this.container.get('api')
    }

    async destroy() {
        // do nothing
    }

    render(template, ctx) {
        return this._view.render(template, ctx)
    }

    redirect(url) {
        window.location.href = url
        return ''
    }
}
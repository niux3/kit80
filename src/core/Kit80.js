import { TemplateEngine } from '@niuxe/template-engine'
import {
    PartialsPlugin,
    LayoutPlugin,
    HelpersPlugin,
    StrictModePlugin,
    I18nPlugin
} from '@niuxe/template-engine/plugins'
import { Container } from './Container'
import { View } from './View'
import { Configuration } from './Configuration'
import { Dispatcher } from './Dispatcher'

export class Kit80 {
    constructor(idSelector = 'app') {
        Configuration.init(idSelector)
        this._container = new Container()
        this._registerServices()
        this._dispatcher = new Dispatcher(Configuration)
    }

    _registerServices() {
        this.container.set('templates', () => import.meta.glob('../views/**/*.html', { query: '?raw', import: 'default' }))
        this.container.set('templateEngine', () => new TemplateEngine()
            .use(LayoutPlugin)
            .use(PartialsPlugin)
            .use(StrictModePlugin)
            .use(I18nPlugin)
            .use(HelpersPlugin))
        this._container.set('view', (container) => new View(container))
    }

    run() {
        this._dispatcher.run()
        return this
    }

    get container() {
        return this._container
    }
}
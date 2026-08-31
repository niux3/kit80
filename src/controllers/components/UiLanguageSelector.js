import templateHTML from '../../templates/components/ui_language_selector.html?raw'
import { TemplateEngine } from '@niuxe/template-engine'


export class UiLanguageSelector extends HTMLElement {

    constructor() {
        super()
        this._engine = new TemplateEngine()
        this._opened = false
        this._data = this.getAttribute('data')
    }

    connectedCallback() {
        const html = this._engine.render(templateHTML, { data: this._data })
        const fragment = document.createRange().createContextualFragment(html)
        if (fragment) {
            this.appendChild(fragment)
            this.button = this.querySelector('button')

            this.button?.addEventListener('click', this.handleClick)
        }
    }

    disconnectedCallback() {
        this.button?.removeEventListener('click', this.handleClick)
    }

    handleClick(e) {
        e.preventDefault()
        this._opened = !this._opened
        console.log('_opened > ', this._opened)
    }
}
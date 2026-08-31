import templateHTML from '../../templates/components/ui_language_selector.html?raw'
import { TemplateEngine } from '@niuxe/template-engine'


export class UiLanguageSelector extends HTMLElement {

    constructor() {
        super()
        this._engine = new TemplateEngine()
        this._opened = false
        this._data = JSON.parse(this.getAttribute('data'))
        this._currentLanguage = this.getAttribute('current-language')
    }

    connectedCallback() {
        const html = this._engine.render(templateHTML, { data: this._data, currentLanguage: this._currentLanguage })
        const fragment = document.createRange().createContextualFragment(html)
        if (fragment) {
            this.appendChild(fragment)
            this.button = this.querySelector('button')
            this.menu = this.querySelector('ul')
            console.log(this.button)
            console.log(this.menu)

            this.button?.addEventListener('click', this.handleClick.bind(this))
        }
    }

    disconnectedCallback() {
        this.button?.removeEventListener('click', this.handleClick.bind(this))
    }

    handleClick(e) {
        e.preventDefault()
        this._opened = !this._opened
        this.button.setAttribute('aria-expanded', this._opened ? 'true' : 'false')
        this.button.nextElementSibling.setAttribute('aria-hidden', this._opened ? 'false' : 'true')
    }
}
import templateHTML from '../../templates/components/ui_language_selector.html?raw'
import { TemplateEngine } from '@niuxe/template-engine'
import { withKit80 } from '../../core/ComponentMixin.js'


export class UiLanguageSelector extends withKit80(HTMLElement) {

    constructor() {
        super()
        console.log('UiLanguageSelector >>>>', this.render('<p>bla == [[=data]]</p>', { data: 'bla' }))
        console.log('UiLanguageSelector >>>>', this.getCtx())
        this._engine = new TemplateEngine()
        this._opened = false
        this._data = JSON.parse(this.getAttribute('data'))
        this._currentLanguage = this.getAttribute('current-language')
    }

    connectedCallback() {
        const html = this.render(templateHTML, { data: this._data, currentLanguage: this._currentLanguage })
        const fragment = document.createRange().createContextualFragment(html)
        if (fragment) {
            this.appendChild(fragment)
            this.button = this.querySelector('button')
            this.menu = this.querySelector('ul')

            this.button?.addEventListener('click', this.handleButtonClick.bind(this))
            this.menu?.addEventListener('click', this.handleMenuClick.bind(this))

        }
    }

    disconnectedCallback() {
        this.button?.removeEventListener('click', this.handleButtonClick.bind(this))
        this.menu?.removeEventListener('click', this.handleMenuClick.bind(this))
    }

    handleButtonClick(e) {
        e.preventDefault()
        this._opened = !this._opened
        this.button.setAttribute('aria-expanded', this._opened ? 'true' : 'false')
        this.button.nextElementSibling.setAttribute('aria-hidden', this._opened ? 'false' : 'true')
    }

    handleMenuClick(e) {
        // Retrouve l'élément <a> même si l'utilisateur a cliqué sur un élément enfant
        const link = e.target.closest('a')
        if (!link) return

        const lang = link.textContent.trim().toLowerCase()
        localStorage.setItem('lang', lang)
    }
}
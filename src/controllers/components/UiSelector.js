import template from '../../templates/components/ui_selector.html?raw'
import { withKit80 } from '../../core/ComponentMixin.js'

export class UiSelector extends withKit80(HTMLElement) {
    constructor() {
        super()
        this._opened = false
        this._onButtonClick = this.handleButtonClick.bind(this)
        this._onMenuClick = this.handleMenuClick.bind(this)
    }

    connectedCallback() {
        const ctx = {
            label: this.getAttribute('label') || ''
        }

        const html = this.render(template, ctx)
        const fragment = document.createRange().createContextualFragment(html)
        const existingChildren = Array.from(this.childNodes)
        if (fragment) {
            // Insère le bouton + conteneur de menu autour/au-dessus du slot existant
            this.prepend(fragment)

            this.button = this.querySelector('button')
            this.menu = this.querySelector('#ui-selector-menu')

            existingChildren.forEach(n => this.menu.appendChild(n))

            this.button?.addEventListener('click', this._onButtonClick.bind(this))
            this.menu?.addEventListener('click', this._onMenuClick.bind(this))
        }
    }

    disconnectedCallback() {
        this.button?.removeEventListener('click', this._onButtonClick.bind(this))
        this.menu?.removeEventListener('click', this._onMenuClick.bind(this))
    }

    handleButtonClick(e) {
        e.preventDefault()
        this._opened = !this._opened
        this.button.setAttribute('aria-expanded', this._opened ? 'true' : 'false')
        if (this.menu) {
            this.menu.setAttribute('aria-hidden', this._opened ? 'false' : 'true')
        }
    }

    handleMenuClick(e) {
        const target = e.target.closest('a, button')
        console.log('target', target)
        if (!target) return

        this._opened = false
        this.button.setAttribute('aria-expanded', 'false')
        if (this.menu) this.menu.setAttribute('aria-hidden', 'true')

        this.dispatchEvent(new CustomEvent('ui_selector:select', {
            bubbles: true,
            composed: true,
            detail: {
                value: target.dataset.value || target.textContent.trim().toLowerCase(),
                target
            }
        }))
    }
}
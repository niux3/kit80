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
        queueMicrotask(() => {
            if (this.querySelector('button[aria-haspopup]')) return

            const ctx = {
                label: this.getAttribute('label') || ''
            }

            const html = this.render(template, ctx)
            const fragment = document.createRange().createContextualFragment(html)
            const existingChildren = Array.from(this.childNodes)

            if (fragment) {
                this.prepend(fragment)

                this.button = this.querySelector('button')
                this.menu = this.querySelector('#ui-selector-menu') || this.querySelector('.selector-menu')

                if (this.menu) {
                    existingChildren.forEach(n => this.menu.appendChild(n))
                }

                // Binding des événements
                this.button?.addEventListener('click', this._onButtonClick)
                this.addEventListener('click', this._onMenuClick)
            }
        })
    }

    disconnectedCallback() {
        this.button?.removeEventListener('click', this._onButtonClick)
        this.removeEventListener('click', this._onMenuClick)
    }

    handleButtonClick(e) {
        e.preventDefault()
        e.stopPropagation()
        this._opened = !this._opened
        this.button.setAttribute('aria-expanded', this._opened ? 'true' : 'false')
        if (this.menu) {
            this.menu.setAttribute('aria-hidden', this._opened ? 'false' : 'true')
        }
    }

    handleMenuClick(e) {
        const target = e.target.closest('a, button')
        // Si le clic vient du bouton principal de toggle, on l'ignore dans ce handler
        if (!target || target === this.button) return

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
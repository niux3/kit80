// controllers/components/UiToggle.js
import template from '../../templates/components/ui_toggle.html?raw'
import { withKit80 } from '../../core/ComponentMixin.js'

export class UiToggle extends withKit80(HTMLElement) {
    #children = []

    static get observedAttributes() {
        return ['checked', 'label']
    }

    connectedCallback() {
        this.#children = Array.from(this.children)
        const label = this.getAttribute('label') || ''
        this.innerHTML = this.render(template, { label })
        this.#updateIcon()
        this.addEventListener('click', this.#handleClick.bind(this))
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.children.length === 0) {
            this.#updateIcon()
        }
    }

    get checked() {
        return this.hasAttribute('checked')
    }

    #handleClick(e) {
        if (this.checked) {
            this.removeAttribute('checked')
        } else {
            this.setAttribute('checked', '')
        }
        this.#updateIcon()

        this.dispatchEvent(new CustomEvent('ui_toggle:change', {
            bubbles: true,
            composed: true,
            detail: {
                checked: this.checked
            }
        }))
    }

    #updateIcon() {
        const button = this.querySelector('button')
        if (!button || this.#children.length < 2) return

        const [item0, item1] = this.#children
        const activeSvg = this.checked ? item1 : item0

        button.querySelectorAll('svg').forEach(svg => svg.remove())
        button.insertAdjacentHTML('afterbegin', activeSvg.cloneNode(true).outerHTML)
    }
}
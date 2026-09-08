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
        this.innerHTML = this.render(template, { label, checked: this.checked })
        this.#updateIcon()
        this.addEventListener('click', this.#handleClick.bind(this))
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.#updateIcon()
        }
    }

    get checked() {
        return this.hasAttribute('checked')
    }

    set checked(value) {
        if (value) {
            this.setAttribute('checked', '')
        } else {
            this.removeAttribute('checked')
        }
    }

    #handleClick(e) {
        // 1. Mutation claire de l'état
        this.checked = !this.checked

        // 2. Mise à jour du rendu visuel
        this.#updateIcon()

        // 3. Dispatch de l'événement avec l'état à jour
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
        if (!button) return

        // Mise à jour de l'accessibilité sur le bouton interne
        button.setAttribute('aria-checked', String(this.checked))

        if (this.#children.length < 2) return

        const [item0, item1] = this.#children
        const activeSvg = this.checked ? item1 : item0

        button.querySelectorAll('svg').forEach(svg => svg.remove())
        button.insertAdjacentHTML('afterbegin', activeSvg.cloneNode(true).outerHTML)
    }
}
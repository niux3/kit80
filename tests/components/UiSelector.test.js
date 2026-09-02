import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UiSelector } from '../../src/controllers/components/UiSelector.js'

if (!customElements.get('ui-selector')) {
    customElements.define('ui-selector', UiSelector)
}

describe('UiSelector Web Component', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
    })

    it('should project children into menu and update aria attributes on toggle', async () => {
        document.body.innerHTML = `
            <ui-selector label="EN">
                <ul>
                    <li><a href="/fr" data-value="fr">FR</a></li>
                </ul>
            </ui-selector>
        `

        // Attente de la résolution de queueMicrotask
        await Promise.resolve()

        const selector = document.querySelector('ui-selector')
        const button = selector.querySelector('button')
        const menu = selector.querySelector('#ui-selector-menu') || selector.querySelector('.selector-menu')
        const link = selector.querySelector('a')

        expect(menu.contains(link)).toBe(true)
        expect(button.getAttribute('aria-expanded')).toBe('false')

        button.click()
        expect(button.getAttribute('aria-expanded')).toBe('true')
        expect(menu.getAttribute('aria-hidden')).toBe('false')
    })

    it('should dispatch ui_selector:select custom event when an option is clicked', async () => {
        document.body.innerHTML = `
            <ui-selector label="EN">
                <ul>
                    <li><button type="button" data-value="fr">FR</button></li>
                </ul>
            </ui-selector>
        `

        // Attente de la résolution de queueMicrotask
        await Promise.resolve()

        const selector = document.querySelector('ui-selector')
        const link = selector.querySelector('button[data-value="fr"]')
        const spyEvent = vi.fn()

        window.addEventListener('ui_selector:select', spyEvent)

        link.click()

        expect(spyEvent).toHaveBeenCalledOnce()
        const eventDetail = spyEvent.mock.calls[0][0].detail
        expect(eventDetail.value).toBe('fr')
        expect(eventDetail.target).toBe(link)
    })
})
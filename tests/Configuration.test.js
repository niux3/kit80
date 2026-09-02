import { describe, it, expect, beforeEach } from 'vitest'
import { Configuration } from '../src/Configuration'

describe('Configuration', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
        Configuration.appContainer = null
    })

    it('should resolve the DOM element using the default "app" ID selector', () => {
        document.body.innerHTML = '<div id="app"></div>'

        Configuration.init()

        expect(Configuration.appContainer).not.toBeNull()
        expect(Configuration.appContainer?.id).toBe('app')
    })

    it('should resolve the DOM element with a custom ID selector', () => {
        document.body.innerHTML = '<div id="custom-root"></div>'

        Configuration.init('custom-root')

        expect(Configuration.appContainer?.id).toBe('custom-root')
    })

    it('should return null if target DOM element is missing', () => {
        Configuration.init('missing-element')

        expect(Configuration.appContainer).toBeNull()
    })
})
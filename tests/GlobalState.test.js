import { describe, it, expect, beforeEach } from 'vitest'
import { GlobalState } from '../src/core/GlobalState.js' // Ajuster le chemin selon la structure

describe('GlobalState', () => {
    let state

    beforeEach(() => {
        state = new GlobalState()
    })

    describe('set() & get()', () => {
        it('should initialize with an empty state', () => {
            expect(state.get()).toEqual({})
        })

        it('should store and retrieve a key-value pair', () => {
            state.set('user', { name: 'Alice', role: 'admin' })
            expect(state.get('user')).toEqual({ name: 'Alice', role: 'admin' })
        })

        it('should return undefined for non-existent keys', () => {
            expect(state.get('non_existent')).toBeUndefined()
        })

        it('should return the full state object when get() is called without arguments or with null', () => {
            state.set('theme', 'dark')
            state.set('lang', 'fr')

            expect(state.get()).toEqual({ theme: 'dark', lang: 'fr' })
            expect(state.get(null)).toEqual({ theme: 'dark', lang: 'fr' })
        })

        it('should overwrite existing keys when set with a new value', () => {
            state.set('theme', 'light')
            state.set('theme', 'dark')

            expect(state.get('theme')).toBe('dark')
        })

        it('should correctly store falsy values', () => {
            state.set('isEnabled', false)
            state.set('count', 0)
            state.set('emptyString', '')
            state.set('nullValue', null)

            expect(state.get('isEnabled')).toBe(false)
            expect(state.get('count')).toBe(0)
            expect(state.get('emptyString')).toBe('')
            expect(state.get('nullValue')).toBeNull()
        })

        it('should support method chaining on set()', () => {
            const instance = state.set('a', 1).set('b', 2).set('c', 3)

            expect(instance).toBe(state)
            expect(state.get()).toEqual({ a: 1, b: 2, c: 3 })
        })
    })

    describe('has()', () => {
        it('should return true if a key exists and is not undefined', () => {
            state.set('lang', 'fr')
            state.set('nullKey', null)
            state.set('zeroKey', 0)

            expect(state.has('lang')).toBe(true)
            expect(state.has('nullKey')).toBe(true)
            expect(state.has('zeroKey')).toBe(true)
        })

        it('should return false if a key does not exist', () => {
            expect(state.has('missingKey')).toBe(false)
        })

        it('should return false if a key is explicitly set to undefined', () => {
            state.set('undefinedKey', undefined)
            expect(state.has('undefinedKey')).toBe(false)
        })
    })

    describe('reset()', () => {
        it('should clear all stored properties', () => {
            state.set('a', 1).set('b', 2)
            expect(state.get()).toEqual({ a: 1, b: 2 })

            state.reset()
            expect(state.get()).toEqual({})
            expect(state.has('a')).toBe(false)
        })

        it('should support method chaining on reset()', () => {
            state.set('a', 1)
            const instance = state.reset()

            expect(instance).toBe(state)
            expect(state.get()).toEqual({})
        })
    })
})
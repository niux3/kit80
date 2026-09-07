/**
 * Global reactive state management service with subscription capabilities.
 * Centralizes application state and notifies subscribers on changes.
 *
 * @example
 * const state = new GlobalState()
 *
 * // Subscribe to changes
 * const unsubscribe = state.subscribe('theme', (value, oldValue) => {
 *   console.log(`Theme changed from ${oldValue} to ${value}`)
 * })
 *
 * // Update state (triggers notification)
 * state.set('theme', 'dark')
 *
 * // Unsubscribe when done
 * unsubscribe()
 */
export class GlobalState {
    /**
     * Internal state storage.
     * @private
     * @type {Record<string, any>}
     */
    #state = {}

    /**
     * Subscribers grouped by state key.
     * @private
     * @type {Map<string, Set<Function>>}
     */
    #subscribers = new Map()

    /**
     * Global subscribers that listen to all state changes.
     * @private
     * @type {Set<Function>}
     */
    #globalSubscribers = new Set()

    /**
     * Sets a value for a specific key and notifies subscribers.
     *
     * @param {string} key - State key identifier.
     * @param {any} value - Value to store.
     * @param {boolean} [silent=false] - If true, skip notification.
     * @returns {this} Current instance for chaining.
     *
     * @example
     * state.set('user', { name: 'Alice' })
     * state.set('theme', 'dark', true) // Silent update
     */
    set(key, value, silent = false) {
        const oldValue = this.#state[key]
        const hasChanged = oldValue !== value

        if (hasChanged) {
            this.#state[key] = value
            if (!silent) {
                this.#notify(key, value, oldValue)
            }
        }

        return this
    }

    /**
     * Sets multiple key-value pairs at once.
     * Triggers a single notification per changed key.
     *
     * @param {Record<string, any>} updates - Object with key-value pairs to update.
     * @param {boolean} [silent=false] - If true, skip all notifications.
     * @returns {this} Current instance for chaining.
     *
     * @example
     * state.setMultiple({
     *   theme: 'dark',
     *   language: 'fr',
     *   user: { name: 'Alice' }
     * })
     */
    setMultiple(updates, silent = false) {
        const changed = []

        for (const [key, value] of Object.entries(updates)) {
            const oldValue = this.#state[key]
            if (oldValue !== value) {
                this.#state[key] = value
                changed.push({ key, value, oldValue })
            }
        }

        if (!silent && changed.length > 0) {
            for (const change of changed) {
                this.#notify(change.key, change.value, change.oldValue)
            }
        }

        return this
    }

    /**
     * Retrieves a value by key or the entire state.
     *
     * @param {string|null} [key=null] - State key (null returns full state).
     * @returns {any} The stored value or full state object.
     *
     * @example
     * const theme = state.get('theme')
     * const fullState = state.get()
     */
    get(key = null) {
        if (key === null) return this.#state
        return this.#state[key]
    }

    /**
     * Checks if a key exists in the state.
     *
     * @param {string} key - State key to check.
     * @returns {boolean} True if key exists and is not undefined.
     *
     * @example
     * if (state.has('user')) {
     *   console.log('User is defined')
     * }
     */
    has(key) {
        return this.#state[key] !== undefined
    }

    /**
     * Subscribes to changes for a specific key.
     *
     * @param {string} key - State key to watch.
     * @param {Function} callback - Function called with (newValue, oldValue, key).
     * @returns {Function} Unsubscribe function.
     *
     * @example
     * const unsubscribe = state.subscribe('theme', (newVal, oldVal) => {
     *   document.documentElement.dataset.theme = newVal
     * })
     *
     * // Later...
     * unsubscribe()
     */
    subscribe(key, callback) {
        if (!this.#subscribers.has(key)) {
            this.#subscribers.set(key, new Set())
        }
        this.#subscribers.get(key).add(callback)

        return () => {
            const subs = this.#subscribers.get(key)
            if (subs) {
                subs.delete(callback)
                if (subs.size === 0) {
                    this.#subscribers.delete(key)
                }
            }
        }
    }

    /**
     * Subscribes to all state changes.
     *
     * @param {Function} callback - Function called with (newState, key, oldValue).
     * @returns {Function} Unsubscribe function.
     *
     * @example
     * const unsubscribe = state.subscribeAll((state, key, oldVal) => {
     *   console.log(`State changed: ${key} = ${state[key]} (was ${oldVal})`)
     * })
     */
    subscribeAll(callback) {
        this.#globalSubscribers.add(callback)
        return () => this.#globalSubscribers.delete(callback)
    }

    /**
     * Unsubscribes a specific callback from a key.
     * Alternative to using the returned unsubscribe function.
     *
     * @param {string} key - State key to unsubscribe from.
     * @param {Function} callback - The callback function to remove.
     * @returns {this} Current instance for chaining.
     *
     * @example
     * const handler = (newVal) => console.log(newVal)
     * state.subscribe('theme', handler)
     * state.unsubscribe('theme', handler)
     */
    unsubscribe(key, callback) {
        const subs = this.#subscribers.get(key)
        if (subs) {
            subs.delete(callback)
            if (subs.size === 0) {
                this.#subscribers.delete(key)
            }
        }
        return this
    }

    /**
     * Unsubscribes a callback from all keys.
     *
     * @param {Function} callback - The callback function to remove everywhere.
     * @returns {this} Current instance for chaining.
     *
     * @example
     * const handler = (newVal) => console.log(newVal)
     * state.subscribe('theme', handler)
     * state.subscribe('lang', handler)
     * state.unsubscribeAll(handler) // Removes from both
     */
    unsubscribeAll(callback) {
        for (const [key, subs] of this.#subscribers) {
            subs.delete(callback)
            if (subs.size === 0) {
                this.#subscribers.delete(key)
            }
        }
        this.#globalSubscribers.delete(callback)
        return this
    }

    /**
     * Notifies subscribers of a state change.
     *
     * @private
     * @param {string} key - Changed key.
     * @param {any} newValue - New value.
     * @param {any} oldValue - Old value.
     */
    #notify(key, newValue, oldValue) {
        // Key-specific subscribers
        const subs = this.#subscribers.get(key)
        if (subs) {
            subs.forEach(callback => {
                try {
                    callback(newValue, oldValue, key)
                } catch (error) {
                    console.error(`[GlobalState] Subscriber error for "${key}":`, error)
                }
            })
        }

        // Global subscribers
        const fullState = this.#state
        this.#globalSubscribers.forEach(callback => {
            try {
                callback(fullState, key, oldValue)
            } catch (error) {
                console.error('[GlobalState] Global subscriber error:', error)
            }
        })
    }

    /**
     * Resets the entire state (clears all values).
     * Does NOT clear subscribers.
     *
     * @returns {this} Current instance for chaining.
     *
     * @example
     * state.reset() // All values are cleared
     */
    reset() {
        this.#state = {}
        return this
    }

    /**
     * Clears all subscribers without affecting state.
     *
     * @returns {this} Current instance for chaining.
     *
     * @example
     * state.clearSubscribers() // Clean up all subscriptions
     */
    clearSubscribers() {
        this.#subscribers.clear()
        this.#globalSubscribers.clear()
        return this
    }
}
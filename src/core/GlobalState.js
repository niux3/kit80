/**
 * Global state management service shared across controllers and Web Components.
 * Centralizes context data and allows key-value state updates, retrieval, and resetting.
 */
export class GlobalState {
    constructor() {
        /**
         * Internal state storage object.
         * @protected
         * @type {Record<string, any>}
         */
        this._state = {}
    }

    /**
     * Sets or updates a key-value pair in the global state store.
     *
     * @param {string} key - The state key identifier.
     * @param {any} value - The value to store.
     * @returns {this} The current GlobalState instance for method chaining.
     */
    set(key, value) {
        this._state[key] = value
        return this
    }

    /**
     * Retrieves a specific value by key, or returns the entire state object if no key is provided.
     *
     * @param {string|null} [key=null] - Optional state key identifier.
     * @returns {any} The stored value for the given key, or the full state object.
     */
    get(key = null) {
        if (key === null) return this._state
        return this._state[key]
    }

    /**
     * Checks if a specific key exists within the state store.
     *
     * @param {string} key - The state key identifier to check.
     * @returns {boolean} `true` if the key exists and is not undefined, `false` otherwise.
     */
    has(key) {
        return this._state[key] !== undefined
    }

    /**
     * Resets the entire state store back to an empty object (useful for test teardowns).
     *
     * @returns {this} The current GlobalState instance for method chaining.
     */
    reset() {
        this._state = {}
        return this
    }
}
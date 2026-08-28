/**
 * Dependency Injection Container managing service factories, singleton instances,
 * and resolution of dependencies.
 */
export class Container {
    /**
     * Map storing service factory definitions and options.
     * @type {Map<string, { factory: (container: Container) => any, shared: boolean }>}
     */
    #factories = new Map()

    /**
     * Map storing instantiated singleton service instances.
     * @type {Map<string, any>}
     */
    #instances = new Map()

    /**
     * Registers a service factory in the container.
     *
     * @param {string} name - The unique service name identifier.
     * @param {(container: Container) => any} factory - Factory function that receives the container instance and returns the service.
     * @param {Object} [options={}] - Registration options.
     * @param {boolean} [options.shared=true] - If true, the service is treated as a singleton (cached on first instantiation).
     * @returns {this} The current Container instance for method chaining.
     */
    set(name, factory, { shared = true } = {}) {
        this.#factories.set(name, { factory, shared })
        return this
    }

    /**
     * Checks if a service factory is registered in the container.
     *
     * @param {string} name - The service name identifier to check.
     * @returns {boolean} `true` if the service is registered, `false` otherwise.
     */
    has(name) {
        return this.#factories.has(name)
    }

    /**
     * Retrieves or instantiates a registered service by name.
     *
     * @param {string} name - The registered service identifier.
     * @returns {any} The resolved service instance or value.
     * @throws {Error} Throws an error if the service is not registered in the container.
     */
    get(name) {
        if (this.#instances.has(name)) return this.#instances.get(name)

        const entry = this.#factories.get(name)
        if (!entry) {
            throw new Error(`Container: service "${name}" non enregistré`)
        }

        const instance = entry.factory(this)
        if (entry.shared) this.#instances.set(name, instance)

        return instance
    }

    /**
     * Resolves an array of service names into their corresponding instances in order.
     * Used by the Dispatcher to construct dependencies for controllers or services.
     *
     * @param {string[]} [names=[]] - Array of service name identifiers to resolve.
     * @returns {any[]} An array containing the resolved service instances.
     */
    resolve(names = []) {
        return names.map(name => this.get(name))
    }
}
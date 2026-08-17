export class Container {
    #factories = new Map()
    #instances = new Map()

    /**
     * Enregistre un service.
     * @param {string} name
     * @param {(container: Container) => any} factory
     * @param {{ shared?: boolean }} options - shared=true (défaut) => singleton, comme dans Slim
     */
    set(name, factory, { shared = true } = {}) {
        this.#factories.set(name, { factory, shared })
        return this
    }

    has(name) {
        return this.#factories.has(name)
    }

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
     * Résout une liste de noms de services en instances, dans l'ordre.
     * Utilisé par le Dispatcher pour construire les arguments du constructeur d'un contrôleur.
     */
    resolve(names = []) {
        return names.map(name => this.get(name))
    }
}
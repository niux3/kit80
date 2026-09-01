/**
 * Service de gestion d'état global partagé entre les contrôleurs et les composants.
 * Centralise les données de contexte et permet leur mise à jour et leur accès
 * depuis n'importe où dans l'application.
 */
export class GlobalState {
    constructor() {
        /** @type {Object<string, any>} */
        this._state = {}
    }

    /**
     * Met à jour l'état global (fusion)
     * @param {Object<string, any>} newState
     */
    set(key, value) {
        this._state[key] = value
        return this
    }

    /**
     * Récupère tout l'état ou une clé spécifique
     * @param {string|null} key
     * @returns {any}
     */
    get(key = null) {
        if (key === null) return this._state
        return this._state[key]
    }

    /**
     * Met à jour une clé spécifique
     * @param {string} key
     * @param {any} value
     */
    has(key) {
        return this._state[key] !== undefined
    }

    /**
     * Reset l'état (utile pour les tests)
     */
    reset() {
        this._state = {}
        return this
    }
}
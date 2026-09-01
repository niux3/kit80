// services/ApiService.js
import { Configuration } from '../Configuration'

export class ApiService {
    constructor() {
        this.baseUrl = Configuration.baseUrlApi
    }

    /**
     * Méthode générique pour effectuer toutes les requêtes HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {})
        }

        const config = {
            method: options.method || 'GET',
            headers,
            ...options
        }

        // Si on envoie des données (POST, PUT, PATCH), on sérialise le body en JSON
        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body)
        }

        try {
            const response = await fetch(url, config)

            // Gestion globale des erreurs HTTP (4xx, 5xx)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                const error = new Error(errorData.message || `Erreur HTTP: ${response.status}`)
                error.status = response.status
                error.data = errorData
                throw error
            }

            // Si la réponse est un 204 No Content (ex: après un DELETE réussi)
            if (response.status === 204) return null

            return await response.json()
        } catch (error) {
            console.error(`[ApiService Error] ${config.method} ${url}:`, error)
            throw error;
        }
    }

    // --- Helpers raccourcis pour une API expressive ---

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' })
    }

    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body })
    }

    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body })
    }

    patch(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PATCH', body })
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' })
    }
}
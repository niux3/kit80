// core/Auth.js
export class Auth {
    constructor(apiClient) {
        this.apiClient = apiClient
        this._user = null
        this._initialized = false
    }

    // Vérifie au chargement de la SPA si le cookie de session FastAPI est valide
    async init() {
        if (this._initialized) return
        try {
            // FastAPI valide le cookie HttpOnly et renvoie les infos du user
            this._user = await this.apiClient.get('/api/auth/me')
        } catch (e) {
            this._user = null
        } finally {
            this._initialized = true
        }
    }

    check() {
        return this._user !== null
    }

    user() {
        return this._user
    }

    async login(credentials) {
        // FastAPI répond en posant le cookie HttpOnly dans les en-têtes HTTP (Set-Cookie)
        this._user = await this.apiClient.post('/api/auth/login', credentials)
    }

    async logout() {
        // FastAPI supprime/invalide le cookie côté serveur
        await this.apiClient.post('/api/auth/logout')
        this._user = null
    }
}
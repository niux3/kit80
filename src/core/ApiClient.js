export default class ApiClient {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl
    }

    async getProject(id) {
        const res = await fetch(`${this.baseUrl}/projects/${id}`)
        if (!res.ok) throw new Error(`Projet ${id} introuvable`)
        return res.json()
    }
}
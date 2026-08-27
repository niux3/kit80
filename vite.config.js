import { defineConfig } from 'vite'

export default defineConfig({
    // Ta config Vite existante...
    test: {
        environment: 'node', // Ou 'happy-dom' plus tard si tu testes le DOM
        globals: true
    }
})
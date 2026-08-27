import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        environment: 'happy-dom', // Active la simulation de l'objet window
        globals: true
    }
})
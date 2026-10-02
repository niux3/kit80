#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const targetDir = process.argv[2]

if (!targetDir) {
    console.error('❌ Veuillez spécifier le nom du projet : npx create-kit80 mon-app')
    process.exit(1)
}

const rootDir = path.resolve(process.cwd(), targetDir)

if (fs.existsSync(rootDir)) {
    console.error(`❌ Le dossier "${targetDir}" existe déjà.`)
    process.exit(1)
}

// Racine de kit80 dans le cache npx / node_modules
const packageRootDir = path.resolve(__dirname, '..')

// Fonction de copie récursive avec exclusion
function copyRecursiveSync(src, dest, ignoreList = []) {
    const exists = fs.existsSync(src)
    if (!exists) return

    const stats = fs.statSync(src)

    if (stats.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true })
        for (const child of fs.readdirSync(src)) {
            if (ignoreList.includes(child)) continue
            copyRecursiveSync(
                path.join(src, child),
                path.join(dest, child),
                ignoreList
            )
        }
    } else {
        fs.copyFileSync(src, dest)
    }
}

console.log(`\n🚀 Initialisation de votre application Kit80 dans "${targetDir}"...\n`)

// 1. Création du dossier cible
fs.mkdirSync(rootDir, { recursive: true })

// 2. Copie de src/ vers mon-app/src/ (en excluant spécifiquement 'core')
const sourceSrc = path.join(packageRootDir, 'src')
const targetSrc = path.join(rootDir, 'src')
copyRecursiveSync(sourceSrc, targetSrc, ['core'])

// 3. Copie des fichiers racine essentiels et assets statiques
const filesToCopy = ['index.html', 'vite.config.js', 'public']
for (const item of filesToCopy) {
    const srcPath = path.join(packageRootDir, item)
    const destPath = path.join(rootDir, item)
    if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, destPath)
    }
}

// 4. Génération du package.json de l'application cliente
const userPackageJson = {
    name: targetDir,
    version: "1.0.0",
    type: "module",
    scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
    },
    dependencies: {
        // En dev local, pointe sur le dossier local de kit80
        "kit80": `file:${packageRootDir}`,
        "@niuxe/template-engine": "^1.4.0",
        "vite": "^7.3.6"
    }
}

fs.writeFileSync(
    path.join(rootDir, 'package.json'),
    JSON.stringify(userPackageJson, null, 2)
)

// 5. Installation automatique des dépendances
console.log('📦 Installation des dépendances (kit80, @niuxe/template-engine, vite)...')
try {
    execSync('npm install', { cwd: rootDir, stdio: 'inherit' })
    console.log(`\n✅ Projet ${targetDir} prêt !`)
    console.log(`\n  cd ${targetDir}`)
    console.log('  npm run dev\n')
} catch (error) {
    console.error('❌ Erreur lors de l\'installation des dépendances.')
}
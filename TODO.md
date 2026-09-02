# Évolution projet

## TODO

- [x] middleware (beforeLoad / afterLoad) -> création controller
- [x] middleware (beforeRender / afterRender)
- [x] middleware (beforeDestroy / afterDestroy)
- [x] middleware (beforeError / afterError)
- [x] auth
- [ ] store
- [x] test unitaire (general)
- [ ] test unitaire (auth, api)
- [ ] test unitaire WithKit80
- [ ] test unitaire GlobalState
- [ ] Dans la class Controller, ajouter une méthode init() qui sera appelée dans le constructeur.
- [x] selecteur de langue
- [ ] améliorer ui_language_selector : Il faut garder la mécanique. Mais toutes les données  doivent être en dehors. **Il faut que le composant soit réutilisable**.
- [ ] sur Chrome le menu contextuel des langues ne s'affiche pas correctement.
- [ ] améliorer le routing. Il y a des routes ambiguës comme /:lang vs /about (insérer des paramètres). Voir discussion plus bas : évolution du routing
- [x] jsdoc
- [x] créer http referer
- [ ] la documentation (comment fonctionne ce truc -> ce sera même le build )
- [ ] BUG ! Lors du build l'ajax sur un fichier json ne fonctione pas. Les pages renvoient erreur 500 !
- [ ] darkmode
- [x] Gestion des métadonnées et du Titre de page (<title>, OpenGraph)
- [ ] Revoir peut être l'affichage de title. Actuellement, il s'affiche avec le nom de l'application (ex : Accueil - Kit80)
- [ ] Gestion du cycle de vie des requêtes (AbortController / Annulation). Voir discussion plus bas
- [ ] landing page (~/www/divers/landing-page-kit80/index.html)
- [ ] binaire à créer pour installer le package
- [ ] Benchmark de perf `kit80` (Liste 25 véhicules vs Web Components)
- [ ] Préparer un dataset JSON réaliste (25 objets véhicules dénormalisés).
- [ ] Implémenter des marqueurs `performance.mark()` / `performance.measure()` dans le lifecyle du contrôleur et du Custom Element.
- [ ] Capturer le temps d'injection initiale + premier rendu (DOM Ready).
- [ ] Mesurer l'INP (*Interaction to Next Paint*) sur le toggle favori / actions carte.
- [ ] Profiler la mémoire (Heap JS) sur 10 cycles de destruction / réinjection de la liste (recherche de fuites mémoire).
- [ ] Auditer sous CPU Throttling 4x/6x (profiling mobile) via Remote Debugging USB.


## discussion

### Evolution du routing

route avec params
```Javascript
{ path: '/project-:id-:slug', name: 'project.show', action: 'view@ProjectController', params: {id: /[0-9]+/, slug: /[a-z0-9-]+/} },
```

Non, il n'y aura aucune difficulté majeure. L'architecture actuelle du Router est suffisamment épurée pour intégrer cette évolution très proprement.

Cependant, ton analyse est juste : il y a trois points d'attention bien précis à anticiper.

### 1. getMatch : la compilation dynamique des Regex

Actuellement, tu reconstruis la RegExp à la volée à chaque itération dans la boucle for de getMatch(). Avec l'ajout de règles spécifiques par paramètre, le coût d'exécution dans la boucle va légèrement augmenter.

La solution : compiler les routes à l'instanciation

Pour éviter tout impact sur les performances, ne compile pas les expressions régulières à chaque appel de getMatch(). Prépare tes routes une seule fois dans le constructor :

```Javascript
export class Router {
    constructor() {
        // Pré-compilation des regex à l'initialisation du Router
        this._routes = routes.map(route => ({
            ...route,
            compiledRegex: this._compileRoutePattern(route)
        }))
    }

    _compileRoutePattern(route) {
        let pattern = route.path
            .replace(/:([a-zA-Z0-9_]+)(?=-)/g, (match, param) => {
                const constraint = route.params?.[param]?.source ?? '[^/-]+'
                return `(?<${param}>${constraint})`
            })
            .replace(/:([a-zA-Z0-9_]+)/g, (match, param) => {
                const constraint = route.params?.[param]?.source ?? '[^/]+'
                return `(?<${param}>${constraint})`
            })

        return new RegExp(`^${pattern}$`, 'i')
    }

    getMatch() {
        const rawPath = window.location.pathname.split('?')[0]

        for (const route of this._routes) {
            const match = rawPath.match(route.compiledRegex)
            if (match) {
                const [action, controller] = route.action.split('@')
                return {
                    route,
                    controller,
                    action,
                    params: match.groups ?? {}
                }
            }
        }
        return null
    }
}
```

### 2. urlFor : le contrôle à la génération des URLs

C'est là que réside le vrai piège. Quand tu appelles urlFor('project.show', { id: 'abc', slug: 'mon-projet' }), la méthode doit vérifier si les valeurs transmises respectent les contraintes regex définies dans route.params.

Si les paramètres sont invalides (par exemple un ID alphabétique alors que id: /[0-9]+/), urlFor doit lever une erreur explicite en mode dev ou renvoyer un fallback (#), afin d'éviter la génération de liens cassés dans tes vues.


```Javascript
urlFor(name, params = {}) {
    const route = this._routes.find(r => r.name === name)
    if (!route) return '#'

    let url = route.path

    for (const [key, value] of Object.entries(params)) {
        // Vérification de la contrainte si elle existe
        if (route.params?.[key] && !route.params[key].test(String(value))) {
            console.warn(`[Router] Paramètre "${key}" invalide pour la route "${name}" :`, value)
            return '#'
        }
        url = url.replace(`:${key}`, value)
    }

    return url
}
```

### 3. Impact réel sur les performances

L'impact sera en réalité négligeable si tu respectes la pré-compilation :

    Sens URL → Route (getMatch) : Zéro coût supplémentaire au runtime. La RegExp finale exécutée par le moteur V8 est déjà compilée. La différence entre exécuter (?<id>[^/]+) et (?<id>[0-9]+) est totalement imperceptible pour le navigateur.

    Sens Route → URL (urlFor) : Un simple .test() sur chaque clé d'objet transmise, ce qui prend quelques nanosecondes.

Cette évolution va fiabiliser ton routage (notamment en débloquant des routes ambiguës comme /:lang vs /about) sans alourdir l'exécution.


## AbortController

### scénario

1. L'utilisateur clique sur la page "Projets" (/projects).
2. Ton ProjectsController lance un fetch('/api/projects') qui prend 2 secondes à répondre.
3. Après 500 ms, l'utilisateur s'impatiente et clique immédiatement sur "À propos" (/about).
4. Le Router charge la vue "À propos".
5. Problème : 1,5 seconde plus tard, la promesse de la première requête (/api/projects) se résout enfin. Si ton contrôleur met à jour la vue ou le state à la réception, il écrase la page "À propos" avec les données des projets.


### Dans le Dispatcher

C'est exactement le bon endroit. Placer la gestion de l'annulation au cœur du pipeline de Dispatcher est le choix d'architecture le plus propre et le plus centralisé pour une SPA sans framework lourd.

En le mettant dans Dispatcher, tu évites de dupliquer la moindre ligne de code dans tes contrôleurs ou dans tes services. C'est le chef d'orchestre qui coupe l'activité de l'ancienne page avant de lancer la nouvelle.

Voici comment intégrer AbortController proprement dans ton Dispatcher :

### 1. Modifie Dispatcher.js

Tu ajoutes une propriété this._activeAbortController dans le constructeur et tu déclenches l'annulation tout au début de la méthode _dispatch :

```Javascript
export class Dispatcher {
    constructor(configuration, container) {
        // ... tes propriétés existantes
        /** @private @type {AbortController|null} */
        this._activeAbortController = null
    }

    async _dispatch(options = {}) {
        // -------------------------------------------------------------
        // 0. CANCEL PREVIOUS REQUESTS (si une navigation était déjà en cours)
        // -------------------------------------------------------------
        if (this._activeAbortController) {
            this._activeAbortController.abort()
        }

        // On crée un nouveau contrôleur pour cette nouvelle navigation
        this._activeAbortController = new AbortController()

        const route = this._router.getMatch()

        const context = {
            route,
            params: route?.params ?? {},
            method: options.method || route?.method || 'GET',
            query: Object.fromEntries(new URLSearchParams(window.location.search)),
            body: options.body || null,
            view: null,
            error: null,
            // On injecte le signal d'annulation dans le contexte !
            signal: this._activeAbortController.signal,
            from: this._activeContext ? {
                route: this._activeContext.route,
                params: this._activeContext.params,
                query: this._activeContext.query,
                controller: this._activePage
            } : null
        }

        try {
            // ... le reste de ton try/catch inchangé

        } catch (error) {
            // Ignorer silencieusement si l'erreur est juste une annulation volontaire
            if (error.name === 'AbortError') {
                return
            }

            // -------------------------------------------------------------
            // 4. ERROR
            // -------------------------------------------------------------
            context.error = error

            if (await this._middleware.trigger('beforeError', context, this._activePage) !== false) {
                await this._errors(error)
                await this._middleware.trigger('afterError', context, this._activePage)
            }
        }
    }

    _cleanup() {
        // Annule les requêtes en cours du contrôleur qu'on quitte
        if (this._activeAbortController) {
            this._activeAbortController.abort()
            this._activeAbortController = null
        }

        if (this._activePage && typeof this._activePage.destroy === 'function') {
            this._activePage.destroy()
        }
        this._activePage = null
    }
}
```

### 2. Comment l'utiliser côté Contrôleur / Service

Puisque tu as passé signal: this._activeAbortController.signal dans le context transmis aux hooks et actions, l'accès devient d'une simplicité enfantine.

```Javascript
export class ProjectsController extends Controller {
    // Reçoit le contexte assemblé par le Dispatcher
    async index(context) {
        // Tu transmets context.signal directement à ton ApiService
        const projects = await this._apiService.get('/projects', {
            signal: context.signal
        })

        return this.render('projects/index', { projects })
    }
}
```

Et dans ton ApiService.js, il te suffit de t'assurer que config.signal = options.signal est bien transmis au fetch natif :


```Javascript
// Dans ApiService.js
const config = {
    method: options.method || 'GET',
    headers,
    signal: options.signal, // Transmis au fetch natif
    ...options
}
```

### Le résultat

1. L'utilisateur clique sur /projets, un fetch est lancé avec le signal A.
2. L'utilisateur clique immédiatement sur /about avant la réponse.
3. Le Dispatcher exécute _dispatch(), repère le signal A, appelle .abort().
4. La requête réseau /projets est coupée par le navigateur, l'exception AbortError est attrapée et ignorée proprement.
5. La page /about se charge avec le signal B sans aucune interférence.
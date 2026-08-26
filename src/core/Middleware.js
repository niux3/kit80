// core/MiddlewarePipeline.js
export class Middleware {
    constructor() {
        this._hooks = {
            beforeLoad: [], afterLoad: [],
            beforeRender: [], afterRender: [],
            beforeDestroy: [], afterDestroy: [],
            beforeError: [], afterError: []
        }
    }

    // Enregistrer un middleware global : middleware.register('beforeLoad', fn)
    register(event, fn) {
        if (this._hooks[event]) {
            this._hooks[event].push(fn)
        }
        return this
    }

    // Exécute d'abord les middlewares globaux, puis le hook local du contrôleur s'il existe
    async trigger(event, context, controllerInstance = null) {
        // 1. Globaux
        for (const fn of this._hooks[event]) {
            const result = await fn(context)
            if (result === false) return false // Permet de stopper la chaîne (ex: auth)
        }

        // 2. Hook local sur le contrôleur (ex: controller.beforeRender(context))
        if (controllerInstance && typeof controllerInstance[event] === 'function') {
            const result = await controllerInstance[event](context)
            if (result === false) return false
        }

        return true
    }
}
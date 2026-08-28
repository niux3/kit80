/**
 * Manages global and controller-level lifecycle middleware hooks.
 * Allows executing synchronous or asynchronous middleware functions at key lifecycle events.
 */
export class Middleware {
    /**
     * Creates an instance of Middleware.
     * Initializes the supported lifecycle hook registries.
     */
    constructor() {
        /**
         * Map of registered global middleware callback functions indexed by hook name.
         * @private
         * @type {Object<string, Array<Function>>}
         */
        this._hooks = {
            beforeLoad: [], afterLoad: [],
            beforeRender: [], afterRender: [],
            beforeDestroy: [], afterDestroy: [],
            beforeError: [], afterError: []
        }
    }

    /**
     * Registers a global middleware callback function for a specific lifecycle event.
     *
     * @param {string} event - The target lifecycle event name (e.g., 'beforeLoad', 'beforeRender').
     * @param {Function} fn - The callback function to register. Receives the execution context as its parameter.
     * @returns {this} The current Middleware instance for method chaining.
     */
    register(event, fn) {
        if (this._hooks[event]) {
            this._hooks[event].push(fn)
        }
        return this
    }

    /**
     * Triggers registered global middleware callbacks followed by the controller's local hook method if present.
     * If any callback or hook method returns `false`, execution halts and returns `false`.
     *
     * @param {string} event - The lifecycle event name to execute.
     * @param {Object} context - The current execution context object passed to listeners.
     * @param {Object|null} [controllerInstance=null] - Optional controller instance to execute local hook methods on.
     * @returns {Promise<boolean>} Resolves to `true` if all hooks succeed, or `false` if any hook cancels execution.
     */
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
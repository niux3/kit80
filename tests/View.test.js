import { describe, it, expect, beforeEach, vi } from 'vitest'
import { View } from '../src/core/View'
import { Configuration } from '../src/core/Configuration'

// Mock de Configuration.routes
vi.mock('../src/core/Configuration', () => ({
    Configuration: {
        routes: [
            { name: 'home', path: '/' },
            { name: 'user.show', path: '/users/:id' },
            { name: 'project.detail', path: '/project/:id/:slug' }
        ]
    }
}))

describe('View', () => {
    let mockContainer
    let mockTemplateEngine
    let mockViews
    let mockPartials
    let mockLayouts

    beforeEach(() => {
        mockTemplateEngine = {
            partial: vi.fn(),
            layout: vi.fn(),
            helper: vi.fn(),
            render: vi.fn().mockReturnValue('<h1>Rendered Content</h1>')
        }

        mockViews = {
            '../templates/views/home.html': vi.fn().mockResolvedValue('<h1>Home</h1>'),
            '../templates/views/about.html': vi.fn().mockResolvedValue('<h1>About</h1>')
        }

        mockPartials = {
            '../templates/partials/header.html': '<header>Header</header>',
            '../templates/partials/footer.html': '<footer>Footer</footer>'
        }

        mockLayouts = {
            '../templates/layouts/main.html': '<html><slot /></html>'
        }

        mockContainer = {
            get: vi.fn((key) => {
                switch (key) {
                    case 'templateEngine': return mockTemplateEngine
                    case 'views': return mockViews
                    case 'partials': return mockPartials
                    case 'layouts': return mockLayouts
                    default: return null
                }
            })
        }
    })

    describe('Constructor', () => {
        it('should register partials, layouts and urlFor helper on initialization', () => {
            new View(mockContainer)

            expect(mockTemplateEngine.partial).toHaveBeenCalledWith('header', '<header>Header</header>')
            expect(mockTemplateEngine.partial).toHaveBeenCalledWith('footer', '<footer>Footer</footer>')
            expect(mockTemplateEngine.layout).toHaveBeenCalledWith('main', '<html><slot /></html>')
            expect(mockTemplateEngine.helper).toHaveBeenCalledWith('urlFor', expect.any(Function))
        })
    })

    describe('render', () => {
        it('should load template content and render it with context', async () => {
            const view = new View(mockContainer)
            const context = { title: 'Welcome' }

            const result = await view.render('home', context)

            expect(mockViews['../templates/views/home.html']).toHaveBeenCalled()
            expect(mockTemplateEngine.render).toHaveBeenCalledWith('<h1>Home</h1>', context)
            expect(result).toBe('<h1>Rendered Content</h1>')
        })

        it('should throw an error if template does not exist', async () => {
            const view = new View(mockContainer)

            await expect(view.render('unknown')).rejects.toThrow(
                'Template "unknown" introuvable (../templates/views/unknown.html)'
            )
        })
    })

    describe('urlFor', () => {
        it('should generate path for route without params', () => {
            const view = new View(mockContainer)
            expect(view.urlFor('home')).toBe('/')
        })

        it('should generate path with replaced route parameters', () => {
            const view = new View(mockContainer)
            const url = view.urlFor('project.detail', { id: '12', slug: 'mon-projet' })

            expect(url).toBe('/project/12/mon-projet')
        })

        it('should throw an error if target route is not registered', () => {
            const view = new View(mockContainer)

            expect(() => view.urlFor('non.existent.route')).toThrow(
                'Route "non.existent.route" introuvable'
            )
        })

        it('should throw an error if a required parameter is missing', () => {
            const view = new View(mockContainer)

            expect(() => view.urlFor('user.show')).toThrow(
                'Paramètre "id" manquant pour la route "user.show"'
            )
        })
    })
})
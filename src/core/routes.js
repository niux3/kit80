export default [
    { method: 'GET', path: '/', action: 'home@PagesController', name: 'home' },
    { method: 'GET', path: '/about', action: 'about@PagesController', name: 'about' },
    { method: 'GET', path: '/contact', action: 'contact@PagesController', name: 'contact' },
    { method: 'GET', path: '/project-:id-:slug', action: 'project@ProjectsController', name: 'project' },
]
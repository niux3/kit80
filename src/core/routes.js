export default [
    { path: '/', action: 'home@PagesController', name: 'home' },
    { path: '/about', action: 'about@PagesController', name: 'about' },
    { path: '/contact', action: 'contact@PagesController', name: 'contact' },
    { path: '/project-:id-:slug', action: 'project@ProjectsController', name: 'project' },
]
export default [
    { path: '/', action: 'home@PagesController', name: 'home' },
    { path: '/about', action: 'about@PagesController', name: 'about' },
    { path: '/contact', action: 'contact@PagesController', name: 'contact' },
    { path: '/contact-submit', action: 'contactSubmit@PagesController', name: 'contactSubmit' },
    { path: '/project-:id-:slug', action: 'project@ProjectsController', name: 'project' },
]
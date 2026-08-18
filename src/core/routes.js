// export default [
//     { method: 'GET', path: /^\/$/, action: 'home@PagesController', name: 'home' },
//     { method: 'GET', path: /about/, action: 'about@PagesController', name: 'about' },
//     { method: 'GET', path: /contact/, action: 'contact@PagesController', name: 'contact' },
//     { method: 'GET', path: /project-(?<id>[0-9]+)-(?<slug>[0-9a-z-]+)/i, action: 'project_view@ProjectsController', name: 'project' },
// ]
export default [
    { method: 'GET', path: '/', action: 'home@PagesController', name: 'home' },
    { method: 'GET', path: '/about', action: 'about@PagesController', name: 'about' },
    { method: 'GET', path: '/contact', action: 'contact@PagesController', name: 'contact' },
    { method: 'GET', path: '/project-:id-:slug', action: 'project@ProjectsController', name: 'project' },
]
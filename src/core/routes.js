export default [
    { method: 'GET', re: /^\/$/, action: 'home@PagesController', name: 'home' },
    { method: 'GET', re: /about/, action: 'about@PagesController', name: 'about' },
    { method: 'GET', re: /contact/, action: 'contact@PagesController', name: 'contact' },
    { method: 'GET', re: /project-(?<id>[0-9]+)-(?<slug>[0-9a-z-]+)/i, action: 'project@ProjectsController', name: 'project' },
]
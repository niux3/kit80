export default [
    { path: '/:lang', action: 'home@PagesController', name: 'home' },
    { path: '/', action: 'home@PagesController', name: 'home' },
    { path: '/:lang/about', action: 'about@PagesController', name: 'about' },
]
export default [
    { path: '/:lang', action: 'home@PagesController', name: 'home', params: { lang: /[a-z]{2}/ } },
    { path: '/', action: 'home@PagesController', name: 'home' },
    { path: '/:lang/about', action: 'about@PagesController', name: 'about', params: { lang: /[a-z]{2}/ } },
]
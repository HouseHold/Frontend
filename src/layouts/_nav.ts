import i18n from '../lib/I18n';

export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: i18n.t('nav.dashboard'),
        to: '/dashboard',
        icon: 'cil-speedometer',
      },
      {
        _name: 'hr',
        _class: 'm-0'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: [i18n.t('nav.inventory')],
        _class: 'm-0'
      },
      {
        _name: 'CSidebarNavItem',
        name: i18n.t('nav.stock'),
        to: '/stock/overview',
        icon: 'cil-fridge',
      },
      {
        _name: 'CSidebarNavItem',
        name: i18n.t('nav.stock-add'),
        to: '/stock/purchase',
        icon: 'cil-arrow-thick-to-left',
      },
      {
        _name: 'CSidebarNavItem',
        name: i18n.t('nav.stock-create-product'),
        to: '/stock/product/create',
        icon: 'cil-playlist-add',
      },
      {
        _name: 'CSidebarNavDivider',
        _class: 'm-2'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Extras']
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Pages',
        route: '/pages',
        icon: 'cil-star',
        items: [
          {
            name: 'Login',
            to: '/pages/login',
            icon: 'cil-star'
          },
          {
            name: 'Register',
            to: '/pages/register',
            icon: 'cil-star'
          },
          {
            name: 'Error 404',
            to: '/pages/404',
            icon: 'cil-star'
          },
          {
            name: 'Error 500',
            to: '/pages/500',
            icon: 'cil-star'
          }
        ]
      },
    ]
  }
]

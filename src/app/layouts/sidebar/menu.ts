import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'Dashboard',
    icon: 'home',
    link: '/',
  },
  {
    id: 3,
    label: 'Product Management',
    icon: 'archive',
    //permissions: ['VIEW_PRODUCT'],
    subItems: [
      {
        id: 10,
        label: 'Categories',
        link: '/product/categories',
        parentId: 3,
      },
      {
        id: 12,
        label: 'Products',
        link: '/product',
        parentId: 3
      },
    ]
  },
  {
    id: 4,
    label: 'Orders',
    icon: 'gift',
    link: '/orders',
    //permissions: ['VIEW_ORDER'],
  },
  {
    id: 5,
    label: 'Role Permissions',
    icon: 'key',
    //permissions: ['ASSIGN_ROLE_PERMISSION'],
    subItems: [
      {
        id: 4,
        label: 'Roles',
        link: '/roles',
        parentId: 5,
      },
      {
        id: 11,
        label: 'Permissions',
        link: '/permissions',
        parentId: 5
      },
    ]
  },
  {
    id: 14,
    label: 'Branch Management',
    icon: 'home',
    link: '/branch'
  },
  {
    id: 15,
    label: 'Customer Queries',
    icon: 'book',
    link: '/query'
  },

  {
    id: 6,
    label: 'User Management',
    icon: 'user',
    //roles: ['admin'],
    //permissions: ['VIEW_USER'],
    subItems: [
      {
        id: 7,
        label: 'Staff',
        link: '/all-staff',
        parentId: 6,
      },
      {
        id: 8,
        label: 'Customer',
        link: '/customer',
        parentId: 6
      },
    ]
  },{
    id: 16,
    label: 'Facilities',
    icon: 'box',
    link: 'facilities'
  }

  

];

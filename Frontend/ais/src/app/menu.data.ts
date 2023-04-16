import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Subjects',
    icon: 'layout-outline',
    link: '/pages/subjects',
  },
  {
    title: 'Grades',
    icon: 'edit-2-outline',
    link: '/pages/grades',
  },
  {
    title: 'Documents',
    icon: 'book-outline',
    link: '/pages/documents',
  }
];
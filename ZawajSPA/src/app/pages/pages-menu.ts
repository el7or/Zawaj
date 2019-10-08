import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages',
  },
  {
    title: 'Chat',
    icon: 'message-circle-outline',
    link: '/pages/chat'
  },
  {
    title: 'Search',
    icon: 'search',
    link: '/pages/search'
  },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    link: '/pages/setting',
    data: 'user'
  },
  /* {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  } */
];

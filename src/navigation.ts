import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'About', href: getPermalink('/about') },
    { text: 'Work', href: getPermalink('/work') },
    { text: 'Songs', href: getPermalink('/songs') },
    { text: 'Media', href: getPermalink('/media') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: '',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'About', href: getPermalink('/about') },
        { text: 'Work', href: getPermalink('/work') },
        { text: 'Songs', href: getPermalink('/songs') },
        { text: 'Media', href: getPermalink('/media') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [],
  footNote: '© Kait Kerrigan',
};

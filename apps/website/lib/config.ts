import { Icons } from '@/components/icons';
import { USER } from '@/config/user';

export const DockConfig = {
  navbar: [
    { href: '/', icon: Icons.home, label: 'Home' },
    { href: '/projects', icon: Icons.craft, label: 'Projects' },
    { href: '/blog', icon: Icons.bookmark, label: 'Blog' },
    { href: '/cal', icon: Icons.calendar, label: 'Book a Meeting' },
  ],
  contact: {
    social: {
      GitHub: {
        name: 'GitHub',
        url: USER.social.github,
        icon: Icons.github,
      },
      LinkedIn: {
        name: 'LinkedIn',
        url: USER.social.linkedin,
        icon: Icons.linkedin,
      },
      email: {
        name: 'Send Email',
        url: `mailto:${USER.email}`,
        icon: Icons.email,
      },
    },
  },
};

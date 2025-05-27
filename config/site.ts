export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MyTaskOwl Admin Panel",
  description: "MyTaskowl Admin for managing all stacks.",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: "IoHome",
    },
    {
      label: "Web App",
      href: "/web-app",
      icon: "FaAngular",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Web App",
      href: "/web-app",
    },
  ],
  links: {
    github: "https://github.com",
  },
};

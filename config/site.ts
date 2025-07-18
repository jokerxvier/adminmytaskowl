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
    {
      label: "Beta Program",
      href: "/beta",
      icon: "GrTest",
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
        {
      label: "Beta Program",
      href: "/beta",
    },
  ],
  links: {
    github: "https://github.com",
  },
};

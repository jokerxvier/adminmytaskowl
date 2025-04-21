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
      label: "WebSockets",
      href: "/websocket",
      icon: "SiNestjs",
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
      label: "WebSockets",
      href: "/websocket",
    },
  ],
  links: {
    github: "https://github.com",
  },
};
 
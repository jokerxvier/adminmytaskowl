import { Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  display: 'swap',
  preload: true,
  // Add weight specification to fix Google Fonts loading
  weight: ['400', '500', '600', '700'],
});

// Use system monospace font for now to avoid font loading issues
export const fontMono = {
  variable: "--font-mono",
  className: "font-mono",
};

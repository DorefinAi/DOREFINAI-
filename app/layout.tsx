import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// One typeface for the whole site; hierarchy comes from size and weight.
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Dorefin AI | AI products for newsrooms and digital teams", template: "%s | Dorefin AI" },
  description:
    "Dorefin AI builds purpose-built AI products for media and digital teams: Vartmaan AI for newsrooms and Socia-L AI for digital content. Based in Jaipur, India.",
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const viewport: Viewport = { themeColor: "#07080a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint so the page never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

// One typeface for the whole site; hierarchy comes from size and weight.
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Dorefin AI | AI products for newsrooms and digital teams", template: "%s | Dorefin AI" },
  description:
    "Dorefin AI builds purpose-built AI products for media and digital teams: Vartmaan AI for newsrooms and Socia AI for digital content. Based in Jaipur, India.",
};

// "dorefin-theme" is the key the public site (public/site/app.js) saves; "theme" is the admin's older key.
const themeScript = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("dorefin-theme")||localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#07080a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} data-theme="dark" data-style="mono" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint so the page never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

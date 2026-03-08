import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYNTHGRAPHIX | Digital Earning Platform",
  description: "Earn real money completing tasks, referring friends, and growing your network — all from one powerful dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('platform-theme');var d=t==='dark'?'dark':'light';document.documentElement.classList.add(d)}catch(e){document.documentElement.classList.add('light')}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

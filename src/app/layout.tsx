import "@/assets/css/bootstrap.min.css";
import "@/assets/css/home.css";
import "@/assets/css/index.css";
import ServiceWorkerCleanup from "@/components/service-worker-cleanup";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
config.autoAddCss = false;
const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const dynamic = "force-static";
export const revalidate = false;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ServiceWorkerCleanup />
        {children}
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;

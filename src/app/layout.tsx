import BottomCart from "@/components/bottom-cart";
import ContactBubble from "@/components/layout/ContactBubble";
import { Toaster } from "@/components/ui/sonner";
import { GoogleTagManager } from "@next/third-parties/google";
import classNames from "classnames";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  applicationName: "Dược phẩm CPC1 Hà Nội",
  title: "CPC1 Hà Nội Chính Hãng | Mua Online Giá Tốt",
  description:
    "Mua ngay các sản phẩm online chính hãng tại Shop CPC1HN. Ưu đãi độc quyền, sản phẩm đa dạng, giao nhanh toàn quốc. Đặt hàng ngay tại cpc1hnshop.com.",
  verification: {
    google: "qst9E8XY-NRLfosmzxDTwzaPsE2ruXCbs-ZU_TEPME8",
  },
  openGraph: {
    siteName: "CPC1 Hà Nội",
    title: "CPC1 Hà Nội Chính Hãng | Mua Online Giá Tốt",
    type: "website",
    url: "https://cpc1hnshop.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  return (
    <html
      lang="vi"
      className="light"
      style={{
        colorScheme: "light",
      }}
    >
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#0F172A" />
      <head className="">
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://cpc1hnshop.com/#website",
                  name: "CPC1 Hà Nội",
                  alternateName: ["Shop CPC1HN", "Dược phẩm CPC1 Hà Nội"],
                  url: "https://cpc1hnshop.com/",
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://cpc1hnshop.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://cpc1hnshop.com/#organization",
                  name: "Công ty Cổ phần CPC1 Hà Nội",
                  url: "https://cpc1hnshop.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://cdn.cpc1hn.com/unsafe/1024x0/filters:quality(90)/white-logo.png",
                  },
                  sameAs: [
                    "https://www.facebook.com/CPC1HN",
                    "https://www.youtube.com/@truyenthongcpc1hn348",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+84-363-166-357",
                    contactType: "customer service",
                    areaServed: "VN",
                    availableLanguage: "Vietnamese",
                  },
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://cpc1hnshop.com/#localbusiness",
                  name: "Công ty Cổ phần Dược phẩm CPC1 Hà Nội",
                  image:
                    "https://cdn.cpc1hn.com/unsafe/1024x0/filters:quality(90)/white-logo.png",
                  url: "https://cpc1hnshop.com",
                  telephone: "+84-363-166-357",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Khu đô thị Tây Nam",
                    addressLocality: "Hoàng Mai",
                    addressRegion: "Hà Nội",
                    postalCode: "128200",
                    addressCountry: "VN",
                  },
                  openingHours: "Mo-Fr 08:00-17:30",
                  sameAs: [
                    "https://www.facebook.com/CPC1HN",
                    "https://www.youtube.com/@truyenthongcpc1hn348",
                    "https://www.diigo.com/profile/cpc1hanoi",
                    "https://x.com/cpc1hanoi",
                    "https://www.pinterest.com/cpc1hanoi/",
                    "https://cpc1hanoi.blogspot.com/",
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className={classNames(inter.variable, "bg-primary")}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NZDDS7H6"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          ></iframe>
        </noscript>
        <Providers>
          <NextTopLoader
            height={3}
            showSpinner={false}
            easing="ease"
            speed={200}
          />
          {children}
          {/* <ChatWidget /> */}
        </Providers>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              success: "!bg-green-600 !text-white",
              error: "!bg-red-600 !text-white",
            },
          }}
        />
        <ContactBubble />
        <BottomCart />
      </body>
      {/* Google tag (gtag.js) */}
      <Script id="datalayer-init" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-16888614372"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16888614372');
        `}
      </Script>
      {!!tiktokPixelId && !tiktokPixelId.includes("NEXT_PUBLIC_") && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
          var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
          ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

            ttq.load('${tiktokPixelId}');
            ttq.page();
          }(window, document, 'ttq');
      `}
        </Script>
      )}
      <GoogleTagManager gtmId="GTM-N88GS3L2"></GoogleTagManager>
    </html>
  );
}

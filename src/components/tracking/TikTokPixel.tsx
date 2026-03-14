"use client";

import Script from "next/script";

interface TikTokPixelProps {
  pixelIds: string[];
}

export default function TikTokPixel({ pixelIds }: TikTokPixelProps) {
  console.log(">>> pixelIds", pixelIds);

  if (
    !pixelIds ||
    pixelIds.length === 0 ||
    pixelIds.includes("NEXT_PUBLIC_TIKTOK_PIXEL_ID")
  ) {
    return null;
  }

  // Generate ttq.load calls for each pixel ID
  const loadCalls = pixelIds.map((id) => `ttq.load('${id}');`).join("\n  ");

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ${loadCalls}
  ttq.page();
}(window, document, 'ttq');
      `}
    </Script>
  );
}

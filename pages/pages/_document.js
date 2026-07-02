import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2F5F52" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PDKS" />
        <meta name="description" content="Personel devam takip sistemi" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

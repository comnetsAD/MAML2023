import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="/node_modules/react-grid-layout/css/styles.css"
        />
        <link
          rel="stylesheet"
          href="/node_modules/react-resizable/css/styles.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

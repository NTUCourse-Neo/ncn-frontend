import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta property="og:title" content="NTUCourse Neo" />
          <meta property="og:description" content="全新設計的台大選課網站。" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://course.myntu.me/" />
          <meta
            property="og:image"
            content={`https://course.myntu.me/og.png`}
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

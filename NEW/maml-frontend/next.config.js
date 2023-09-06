/** @type {import('next').NextConfig} */

const SITE_URL = process.env.NODE_ENV === "prod" ? "https://mamleditor.com" : "http://localhost:8989";

const domains = (
  process.env.NODE_ENV === "prod" ? ["mamleditor.com"] : ["localhost"]
).concat([
  "mamleditor-images.s3.us-east-2.amazonaws.com",
]);

const headers = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: headers,
      },
    ];
  },
  reactStrictMode: false,
  swcMinify: true,
  images: { domains: domains },
  env: {
    NEXT_PUBLIC_SITE_URL: SITE_URL,
  }
};

module.exports = nextConfig;

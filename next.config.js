// @ts-check
import withPlaiceholder from "@plaiceholder/next";

/**
 * @type {import('next').NextConfig}
 */
const config = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kadredu.storage.yandexcloud.net"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1"
      }
    ]
  },

};

export default withPlaiceholder(config);

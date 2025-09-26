/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3333",
        pathname: "/arquivos/**",
      },
      {
        protocol: "https",
        hostname: "cajual-app-a3bpcmajf2g6bzbn.brazilsouth-01.azurewebsites.net",
        port: "",
        pathname: "/arquivos/**",
      },
    ],
  },
};

module.exports = nextConfig;

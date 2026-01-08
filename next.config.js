/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['docxtemplater', 'pizzip', '@libsql/client']
  }
};

module.exports = nextConfig;

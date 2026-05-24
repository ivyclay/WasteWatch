import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const host = headersList?.get?.('x-forwarded-host') ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const baseUrl = host?.startsWith?.('http') ? host : `https://${host}`;

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/spending`, lastModified: new Date() },
    { url: `${baseUrl}/anomalies`, lastModified: new Date() },
    { url: `${baseUrl}/agencies`, lastModified: new Date() },
    { url: `${baseUrl}/donate`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
  ];
}

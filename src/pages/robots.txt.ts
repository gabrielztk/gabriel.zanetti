import { isProduction, siteURL } from "../site-env";

export function GET() {
  const body = isProduction
    ? `User-agent: *\nAllow: /\nSitemap: ${siteURL}/sitemap-index.xml\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

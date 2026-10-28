import { getCollection } from 'astro:content';
export async function GET({ site }: { site: URL }) {
 const paths = ['/', '/blog/', '/contato/', ...(await getCollection('blog', ({data})=>!data.draft)).map(p=>`/blog/${p.id}/`)];
 return new Response(`<?xml version="1.0" encoding="utf-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${new URL(p,site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}

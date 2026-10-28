import { getCollection } from 'astro:content';
const escape = (s: string) => s.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export async function GET({ site }: { site: URL }) {
 const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort((a,b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime());
 for (const post of posts) { if (!post.rendered?.html) throw new Error(`Missing rendered feed content: ${post.id}`); }
 const url = (path: string) => new URL(path, site).href;
 const xml = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Gabriel Kawall</title><id>${url('/')}</id><link href="${url('/')}"/><link href="${url('/atom.xml')}" rel="self"/><updated>${posts[0].data.pubDatetime.toISOString()}</updated><author><name>Gabriel Kawall</name></author>${posts.map(p => `<entry><title>${escape(p.data.title)}</title><id>${url(`/blog/${p.id}/`)}</id><link href="${url(`/blog/${p.id}/`)}"/><published>${p.data.pubDatetime.toISOString()}</published><updated>${p.data.pubDatetime.toISOString()}</updated><summary>${escape(p.data.description)}</summary><content type="html" xml:base="${url(`/blog/${p.id}/`)}">${escape(p.rendered!.html)}</content></entry>`).join('')}</feed>`;
 return new Response(xml, {headers:{'Content-Type':'application/atom+xml; charset=utf-8'}});
}

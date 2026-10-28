export const slugify = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
export default function legacyHeadingIds() {
  return (tree) => {
    const used = new Map();
    const text = (node) => node.value || (node.children || []).map(text).join('');
    function visit(node) {
      if (/^h[1-6]$/.test(node.tagName || '')) {
        const base = slugify(text(node));
        const count = used.get(base) || 0;
        used.set(base, count + 1);
        node.properties ||= {};
        node.properties.id = count ? `${base}-${count}` : base;
      }
      for (const child of node.children || []) visit(child);
    }
    visit(tree);
  };
}

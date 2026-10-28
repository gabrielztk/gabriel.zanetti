"""Validate static content parity and the build-time release contract."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import os
# XML inputs below are locally generated build artifacts, never uploaded XML.
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
dist = root / "dist"
production = os.environ.get("SITE_ENV") == "production"
origin = "https://blog.gabrielkawall.net" if production else "https://f5yipw.dev.horai.gabrielkawall.net"


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.ids = set()
        self.titles = 0
        self.noindex = False
        self.avatar = None
        self.favicon = None
        self.canonical = []
        self.metadata = {}
        self.feeds = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title": self.titles += 1
        if "id" in attrs: self.ids.add(attrs["id"])
        if tag == "meta" and attrs.get("name") == "robots": self.noindex = "noindex" in attrs.get("content", "")
        if tag == "img" and "avatar" in attrs.get("class", "").split(): self.avatar = attrs
        if tag == "link" and attrs.get("rel") == "icon": self.favicon = attrs.get("href")
        if tag == "link" and attrs.get("rel") == "canonical": self.canonical.append(attrs.get("href"))
        if tag == "meta" and attrs.get("property"): self.metadata[attrs["property"]] = attrs.get("content")
        if tag == "link" and attrs.get("type") == "application/atom+xml": self.feeds.append(attrs.get("href"))
        for candidate in attrs.get("srcset", "").split(","):
            if candidate.strip(): self.links.append(candidate.strip().split()[0])
        for key in ("src", "href"):
            if attrs.get(key): self.links.append(attrs[key])


pages = {p: Page(p.read_text()) for p in dist.rglob("*.html")}
assert pages, "No built pages"
for path, page in pages.items():
    assert page.titles == 1, f"Duplicate/missing title: {path}"
    assert page.noindex == (not production), f"Wrong indexing mode: {path}"
    route = "/404/" if path.name == "404.html" else "/" + path.relative_to(dist).as_posix().removesuffix("index.html")
    assert page.canonical == [origin + route], f"Wrong canonical: {path}: {page.canonical}"
    assert page.metadata.get("og:url") == origin + route
    assert page.metadata.get("twitter:url") == origin + route
    for key in ("og:image", "twitter:image"):
        assert page.metadata.get(key, "").startswith(origin + "/"), f"Wrong social image origin: {path}"
    assert page.feeds == [origin + "/atom.xml"]
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc: continue
        target = (dist / unquote(parsed.path).lstrip("/")) if parsed.path.startswith("/") else (path.parent / unquote(parsed.path))
        if not parsed.path: target = path
        if target.is_dir(): target = target / "index.html"
        assert target.exists(), f"Broken internal reference {path}: {link}"
        if parsed.fragment and target.suffix == ".html":
            target_page = pages.get(target) or Page(target.read_text())
            assert unquote(parsed.fragment) in target_page.ids, f"Broken fragment {path}: {link}"
home = pages[dist / "index.html"]
assert home.avatar and home.avatar["width"] == "220" and home.avatar["height"] == "220"
assert home.avatar["sizes"] == "(max-width: 520px) 160px, 220px"
assert home.avatar["src"].endswith(".webp") and home.favicon.endswith(".webp")
assert home.avatar["loading"] == "eager" and home.avatar["fetchpriority"] == "high"
variants = home.avatar["srcset"].split(",")
assert {int(v.strip().split()[1][:-1]) for v in variants} == {160, 220, 320, 440, 480, 660}
for candidate in variants:
    asset = dist / candidate.strip().split()[0].lstrip("/")
    assert asset.stat().st_size < 100_000, f"Unexpected portrait payload: {asset}"
for post in json.loads((root / "migration-baseline.json").read_text()):
    text = (dist / "blog" / post["slug"] / "index.html").read_text()
    assert post["date"] in text, f"Missing original date: {post['slug']}"
    assert post["title"].replace("&", "&amp;") in text or post["title"] in text, f"Missing original title: {post['slug']}"
assert (dist / "atom.xml").exists() and (dist / "sitemap.xml").exists()
feed = ET.parse(dist / "atom.xml")
entries = feed.findall("{http://www.w3.org/2005/Atom}entry")
assert len(entries) == 3
for entry in entries:
    content = entry.find("{http://www.w3.org/2005/Atom}content")
    assert content is not None and len(content.text or "") > 100, "Missing full feed content"
    for element in entry.iter():
        if element.tag.endswith("}id"): assert (element.text or "").startswith(origin + "/blog/")
        for key in ("href", "{http://www.w3.org/XML/1998/namespace}base"):
            if key in element.attrib: assert element.attrib[key].startswith(origin + "/")
for element in feed.getroot():
    if element.tag.endswith("}id"): assert element.text == origin + "/"
    if "href" in element.attrib: assert element.attrib["href"].startswith(origin + "/")
for sitemap in dist.glob("sitemap*.xml"):
    for element in ET.parse(sitemap).iter():
        if element.tag.endswith("}loc"): assert (element.text or "").startswith(origin + "/"), f"Wrong sitemap origin: {sitemap}"
robots = (dist / "robots.txt").read_text()
headers = (dist / "_headers").read_text()
if production:
    assert "Disallow:" not in robots and "Allow: /" in robots
    assert f"Sitemap: {origin}/sitemap-index.xml" in robots
    assert not headers.strip(), "Production must not emit preview response headers"
    for path in dist.rglob("*"):
        if path.is_file():
            assert b".dev.horai.gabrielkawall.net" not in path.read_bytes(), f"Private origin leaked: {path}"
else:
    assert robots == "User-agent: *\nDisallow: /\n"
    assert headers == "/*\n  X-Robots-Tag: noindex, nofollow\n"
assert (dist / "pagefind/pagefind.js").is_file(), "Missing local search"
mode = "production indexing and no private URLs" if production else "preview noindex/robots/headers"
print(f"PASS: {len(pages)} pages, local links/assets/fragments, original article dates/titles, 3 full feed entries, canonical/social/feed/sitemap origins, {mode}, Pagefind")

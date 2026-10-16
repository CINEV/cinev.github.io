"""Check committed entry points, deployment metadata and local navigation."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent / 'dist'
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.tags = []; self.feed(source)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

sitemap = ET.parse(ROOT / 'sitemap.xml')
locations = [element.text for element in sitemap.findall('.//{*}loc')]
assert len(locations) == 12 and len(set(locations)) == 12
origin = 'https://' + urlsplit(locations[0]).netloc
for location in locations:
    path = urlsplit(location).path
    file = ROOT / path.lstrip('/') / 'index.html'
    page = Page(file.read_text())
    canonical = [a['href'] for t, a in page.tags if t == 'link' and a.get('rel') == 'canonical']
    assert canonical == [location], (file, canonical)
    alternates = {a['hreflang']: a['href'] for t, a in page.tags if t == 'link' and 'hreflang' in a}
    assert set(alternates) == {'ko', 'en', 'x-default'}, file
    assert all(urlsplit(u).netloc == urlsplit(origin).netloc for u in alternates.values()), file
    for tag, attrs in page.tags:
        for key in ['href', 'src']:
            value = attrs.get(key, '')
            if not value.startswith('/') or value.startswith('//') or value.startswith('/insights/'): continue
            target = ROOT / unquote(urlsplit(value).path).lstrip('/')
            assert target.exists(), (file, value)
    if 'showcase' not in path:
        insights = '/insights/' if path.startswith('/en/') else '/insights/ko/'
        assert any(t == 'a' and a.get('href') == insights for t, a in page.tags), file
assert 'Disallow: /' not in (ROOT / 'robots.txt').read_text()
assert not (ROOT / 'insights').exists()
assert any(t == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for t, a in Page((ROOT / '404.html').read_text()).tags)
print('Verified 12 entry points, canonical/hreflang, sitemap, static links and 404.')

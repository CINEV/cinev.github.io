"""Generate main-site metadata for the Pages deployment origin (no blog copies)."""
import argparse
import re
from pathlib import Path
from urllib.parse import urlsplit
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--origin', default='https://cinev.github.io')
args = parser.parse_args()
origin = args.origin.rstrip('/')
url = urlsplit(origin)
if url.scheme != 'https' or not url.netloc or url.path or url.query or url.fragment:
    parser.error('--origin must be an HTTPS origin without a path')
routes = ['', 'archive/', 'showcase/', 'poseshot/', 'shotloom/', 'a2p/']
urls = []
for language in ['', 'en/']:
    for route in routes:
        path = '/' + language + route
        canonical = origin + path
        file = ROOT / 'dist' / language / route / 'index.html'
        html = file.read_text()
        # Replace generated metadata as well as the older relative alternates.
        html = re.sub(r'\s*<link\b(?=[^>]*(?:rel="canonical"|hreflang=))[^>]*>', '', html)
        html = re.sub(r'\s*<meta\b(?=[^>]*property="og:url")[^>]*>', '', html)
        tags = [f'<link rel="canonical" href="{canonical}" />', f'<meta property="og:url" content="{canonical}" />']
        for code, prefix in [('ko', ''), ('en', 'en/'), ('x-default', '')]:
            tags.append(f'<link rel="alternate" hreflang="{code}" href="{origin}/{prefix}{route}" />')
        html = re.sub(r'\s*</head\s*>', lambda _: '\n    ' + '\n    '.join(tags) + '\n  </head>', html)
        file.write_text(html)
        urls.append(canonical)
(ROOT / 'dist/sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{escape(url)}</loc></url>\n' for url in urls) + '</urlset>\n')
(ROOT / 'dist/robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {origin}/sitemap.xml\nSitemap: https://cinev.com/insights/sitemap_index.xml\n')

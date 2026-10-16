from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit
import re,json,html,subprocess
ROOT=Path(__file__).resolve().parent.parent
pages={'product':'/archive/','poseshot':'/poseshot/','a2p':'/a2p/','shotloom':'/shotloom/'}
M={}
for name in pages:
 src=json.loads((ROOT/'translations'/f'{name}.source.json').read_text());dst=(ROOT/'translations'/f'{name}.en.txt').read_text().splitlines();assert len(src)==len(dst),(name,len(src),len(dst))
 for a,b in zip(src,dst):
  if a in M and M[a]!=b:print('Context translation:',a)
 # Each page gets its own dictionary to preserve contextual wording.
 M.update(dict(zip(src,dst)))
class Translate(HTMLParser):
 def __init__(self,m,base):super().__init__(convert_charrefs=True);self.mapping={re.sub(r"\s+", " ", key.strip()): value for key,value in m.items()};self.base=base;self.out=[];self.raw=0;self.missing=set()
 def translate(self,s):
  key=re.sub(r"\s+", " ", s.strip())
  if key in self.mapping:
   # Preserve outer whitespace where present, but allow English word spacing around inline elements.
   return s[:len(s)-len(s.lstrip())]+self.mapping[key]+s[len(s.rstrip()):]
  if re.search('[가-힣]',key):self.missing.add(key)
  return s
 def handle_decl(self,s):self.out.append('<!'+s+'>')
 def handle_comment(self,s):self.out.append('<!--'+s+'-->')
 def handle_starttag(self,tag,attrs):
  if tag in ['script','style']:self.raw+=1
  result=[]
  for k,v in attrs:
   if v is None:result.append(k);continue
   if k in ['alt','aria-label','title','content']:v=self.translate(v)
   if tag=='html' and k=='lang':v='en'
   if k in ['src','poster','href'] and not v.startswith(('#','https:','http:','data:','mailto:','tel:')):
    original=urljoin(self.base,v)
    parsed=urlsplit(original)
    if k=='href' and parsed.path=='/insights/ko/':v='/insights/'
    elif k=='href' and parsed.path in ['/archive/','/showcase/','/shotloom/','/poseshot/','/a2p/']:v='/en'+original
    elif not v.startswith('/en/'):v=original
   if k=='src' and v.startswith('/app.js'):v='/en/app.js?v=20261015-en'
   result.append(k+'="'+html.escape(v,quote=True)+'"')
  self.out.append('<'+tag+(' '+' '.join(result) if result else '')+'>')
 def handle_startendtag(self,tag,attrs):
  self.handle_starttag(tag,attrs)
  if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:self.handle_endtag(tag)
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.raw-=1
  self.out.append('</'+tag+'>')
 def handle_data(self,s):self.out.append(s if self.raw else html.escape(self.translate(s),quote=False))
for name,base in pages.items():
 src=json.loads((ROOT/'translations'/f'{name}.source.json').read_text());dst=(ROOT/'translations'/f'{name}.en.txt').read_text().splitlines();mapping=dict(zip(src,dst))
 t=Translate(mapping,base);t.feed((ROOT/'dist'/base.lstrip('/')/'index.html').read_text());assert not t.missing,(name,t.missing)
 result=''.join(t.out).replace('</head>','<link rel="stylesheet" href="/english.css"></head>')
 # Language toggle points to the equivalent Korean page before JS loads.
 result=re.sub(r'<a class="portfolio-language"[^>]*>\s*EN\s*</a\s*>',f'<a class="portfolio-language" href="{base}" hreflang="ko" lang="ko" aria-label="한국어로 보기">한국어</a>',result)
 if name=='shotloom':
  result=re.sub(r'<code>CineV</code>\s+shots as','Open <code>CineV</code> shots as',result)
  result=re.sub(r'—\s+<code>Motion</code>','— In the <code>Motion</code>',result)
 out=ROOT/'dist/en'/base.lstrip('/');out.mkdir(parents=True,exist_ok=True);(out/'index.html').write_text(result)
 print(name,'translated',len(src),'strings')
# Translate interactive UI strings without changing timing, playback rates, or logic.
s=(ROOT/'dist/app.js').read_text()
extra={'자동 재생 ▷':'Autoplay ▷','스토리보드 자동 전환 시작':'Start storyboard autoplay','워크플로우 자동 전환 시작':'Start workflow autoplay','작은 신체 비율과 과장된 표정의 캐릭터 표현':'Small proportions and expressive character poses','웹툰풍 인물과 현대적인 배경·드라마 연출':'Webtoon-style characters, modern settings, and dramatic staging'}
for a,b in sorted({**M,**extra}.items(),key=lambda x:-len(x[0])):s=s.replace(a,b)
s=s.replace("+'개 기능군'","+' feature groups'")
(ROOT/'dist/en/app.js').write_text(s)

# Keep generated HTML readable after every translation build.
subprocess.run(["node", str(ROOT/"scripts/format-html.mjs"), *[f"dist/en{base}index.html" for base in pages.values()]], check=True)

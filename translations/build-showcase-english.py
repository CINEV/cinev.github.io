from pathlib import Path
import subprocess
root=Path(__file__).resolve().parent.parent
s=(root/'dist/showcase/index.html').read_text().replace('lang="ko"','lang="en"').replace('웹툰·만화·동화책에서 애니메이션으로. CineV 제작 사례.','From webtoons, manga, and picture books to animation. CineV production examples.')
p=root/'dist/en/showcase';p.mkdir(parents=True,exist_ok=True);(p/'index.html').write_text(s)

subprocess.run(["node", str(root/"scripts/format-html.mjs"), "dist/showcase/index.html", "dist/en/showcase/index.html"], check=True)

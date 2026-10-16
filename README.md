# CINEV Archive

CINEV 팀이 만들어온 제품, 기술, 연구와 작품을 기록한 한글·영어 웹사이트입니다.

- Website: https://cinev.github.io/
- English: https://cinev.github.io/en/

## 구성

- `dist/`: 서비스 종료 예정 안내 첫 화면과 정적 사이트·이미지·영상
- `dist/archive/`, `dist/en/archive/`: 한글·영어 Product 아카이브 첫 화면
- `dist/showcase/`: Showcase 빌드 결과
- `dist/poseshot/`, `dist/shotloom/`, `dist/a2p/`: 프로젝트 상세 페이지
- `dist/en/`: 같은 구성의 영어 페이지
- `showcase-source/`: React·Vite 기반 Showcase 원본
- `translations/`: 한영 번역 자료와 영어 페이지 생성 스크립트
- `.openai/hosting.json`: 기존 Sites 정적 배포 설정

## 로컬 실행

별도 빌드 없이 Python 3으로 전체 사이트를 확인할 수 있습니다.

```sh
python3 -m http.server 5185 --directory dist
```

http://127.0.0.1:5185/ 에 접속합니다.

## Showcase 수정 및 빌드

Node.js 20 이상이 필요합니다.

```sh
cd showcase-source
npm install
npm run build
cd ..
python3 translations/build-showcase-english.py
```

Vite가 `dist/showcase/`를 갱신하며, 마지막 명령은 같은 빌드를 사용하는 영어 진입 페이지를 생성합니다.

## HTML 포맷팅

본문이 있는 HTML은 Prettier로 멀티라인 관리합니다. 최초 실행 전 `npm ci --prefix showcase-source`로 개발 의존성을 설치합니다.

```sh
npm run format:html --prefix showcase-source
npm run format:html:check --prefix showcase-source
```

포맷팅 대상은 `dist/`의 HTML과 `showcase-source/index.html`입니다. 압축된 JS·CSS 번들은 변경하지 않습니다. 영어 페이지 생성과 Showcase 빌드에도 HTML 포맷팅이 포함됩니다. 번역 스크립트 실행에는 Python 3과 Node.js 20 이상이 필요합니다.

## Product·상세 페이지의 영어 버전 생성

```sh
python3 translations/build-english.py
```

한글 원본은 `dist/`에 있으며, `translations/*.source.json`과 대응하는 `*.en.txt`에서 번역을 관리합니다. 본문을 변경할 때 원문·번역을 함께 갱신해야 합니다. 이미지와 영상은 언어별로 복제하지 않고 공통 파일을 사용합니다.

## 배포

`CINEV/cinev.github.io`의 GitHub Pages로 배포합니다. `main`에 push하면 `.github/workflows/deploy-pages.yml`이 저장소에 커밋된 `dist/`를 그대로 배포합니다. Actions에서 수동 실행도 가능합니다. Pages의 Source는 **GitHub Actions**로 설정합니다.

모든 언어·상세 페이지가 디렉터리별 `index.html`로 제공됩니다. Showcase 소스를 수정했다면 위 빌드 명령을 실행한 뒤 갱신된 `dist/`도 함께 커밋해야 합니다. 배포 workflow는 소스를 다시 빌드하지 않습니다.

루트 `/`와 `/en/`는 서비스 종료 예정 안내가 사용하고, 안내 버튼은 `/archive/`와 `/en/archive/`로 연결됩니다. `/insights/`는 별도 `CINEV/insights` 저장소의 블로그가 사용합니다. `dist/insights`나 커스텀 도메인용 `CNAME` 파일을 추가하지 않습니다. 저장소는 비공개 상태로 유지합니다. GitHub Pages 사용 가능 여부는 조직의 요금제에 따릅니다.

## 미디어

페이지 표시·재생에 필요한 이미지·영상·글꼴·CSS는 `dist/`에 함께 보관하며 외부 서버에서 불러오지 않습니다. Showcase 영상은 `dist/landing-media/videos/`, 글꼴과 수식 CSS는 `dist/fonts/`에 있습니다. `external-assets.json`에는 다운로드 원본 URL·크기·SHA-256을 기록합니다(CSS 내부 경로는 다운로드 후 로컬 경로로 변경). 외부 연구 사이트로 이동하는 참고 링크는 원래 주소를 유지합니다. 미디어와 작품의 권리는 각 권리자에게 있으며, 저장소 업로드는 별도 재사용 라이선스를 부여하지 않습니다.

외부 글꼴·KaTeX의 라이선스와 저작권 고지는 [`dist/fonts/licenses/README.md`](dist/fonts/licenses/README.md)에 정리되어 있으며, 배포 파일에도 포함됩니다.

## 웹용 미디어 최적화

`media-optimizations.json`에 웹용 변환 방식·용량·원본 및 결과 SHA-256을 기록합니다. 변환 전 원본은 해당 파일에 명시된 Git 커밋에서 복구할 수 있습니다. `external-assets.json`의 다운로드 해시는 최초 보관한 원본 기준이며, 재압축한 파일의 현재 해시는 `media-optimizations.json`을 기준으로 확인합니다.

글자가 포함된 화면 스크린샷은 무손실 WebP를 사용합니다. 5,120px PoseShot 스크린샷 두 장만 Lanczos 필터로 2,560px로 축소했으며, 나머지 화면 스크린샷은 원래 해상도를 유지합니다. 작품 이미지 일부는 긴 변을 최대 1,920px로 줄인 고품질 WebP를 사용합니다. 영상은 해상도·프레임률·음성을 유지하면서 H.264로 재압축하고, 빠른 재생 시작을 위한 faststart를 적용했습니다.

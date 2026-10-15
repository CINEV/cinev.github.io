# CINEV Archive

CINEV 팀이 만들어온 제품, 기술, 연구와 작품을 기록한 한글·영어 웹사이트입니다.

- Website: https://cinev-archive.cinamon-8104.chatgpt.site/
- English: https://cinev-archive.cinamon-8104.chatgpt.site/en/

## 구성

- `dist/`: 정적 사이트와 이미지·영상
- `dist/showcase/`: Showcase 빌드 결과
- `dist/poseshot/`, `dist/shotloom/`, `dist/a2p/`: 프로젝트 상세 페이지
- `dist/en/`: 같은 구성의 영어 페이지
- `dist/service-closed/`, `dist/en/service-closed/`: 향후 사용할 서비스 종료 안내 페이지. 아카이브 첫 화면과 분리되어 있습니다.
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

## Product·상세 페이지의 영어 버전 생성

```sh
python3 translations/build-english.py
```

한글 원본은 `dist/`에 있으며, `translations/*.source.json`과 대응하는 `*.en.txt`에서 번역을 관리합니다. 본문을 변경할 때 원문·번역을 함께 갱신해야 합니다. 이미지와 영상은 언어별로 복제하지 않고 공통 파일을 사용합니다.

## 배포

정적 호스팅의 공개 디렉터리를 `dist/`로 설정합니다. 모든 언어·상세 페이지가 디렉터리별 `index.html`로 제공됩니다. GitHub 업로드 자체는 기존 Sites 배포를 변경하지 않습니다.

## 미디어

현재 사이트에 포함된 이미지·영상 파일도 함께 보관합니다. 일부 Showcase 동영상 및 외부 연구 링크는 기존 외부 주소를 사용합니다. 미디어와 작품의 권리는 각 권리자에게 있으며, 저장소 업로드는 별도 재사용 라이선스를 부여하지 않습니다.

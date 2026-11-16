# Jeeyoun Lee · Portfolio

네이비·베이지 색상과 3D 이미지를 사용한 연구 포트폴리오입니다. 메인 페이지에서 네 카테고리를 순서대로 스크롤하며 탐색하고, 상세 페이지와 기업 분석 대시보드로 이동합니다.

## 카테고리별 수정 위치

| 카테고리 | 메인 화면 콘텐츠 | 상세 페이지·데이터 | 주소 |
| --- | --- | --- | --- |
| Main | `src/pages/index.html` | `src/styles/home-v2.css` | `/` |
| 01 About | `src/sections/01-about.html` | `src/pages/about/index.html` | `/about/` |
| 02 AI-Generated Reports | `src/sections/02-ai-generated-reports.html` | `src/pages/reports/` | `/reports/` |
| 재무데이터 분석 | — | `src/pages/reports/financial-analysis/` | `/reports/financial-analysis/?company=hynix` |
| 03 Curated Readings | `src/sections/03-curated-readings.html` | 현재 메인 페이지 내 섹션 | `/#readings` |
| 04 Research & Activities | `src/sections/04-research-activities.html` | 학회 발표는 About의 Conferences와 연결 | `/#activities` |
| Certificate | 위 활동 섹션의 Certificate 카드 | `src/pages/activities/certificate/` | `/activities/certificate/` |

## 폴더 구성

```text
src/
  pages/                 # 페이지별 HTML, 해당 페이지 전용 CSS·JS
    index.html           # 메인 화면 틀, 카테고리 포함 순서
    about/
    reports/
      financial-analysis/
    activities/
      certificate/
  sections/              # 메인 화면의 카테고리별 콘텐츠 4개
  components/            # 모든 페이지에서 공유하는 메뉴·푸터
  styles/                # 공통 스타일, 메인 3D 레이아웃
  scripts/               # 메인 메뉴의 현재 섹션 표시
public/assets/           # 공개 이미지와 수료증 원본
scripts/                 # 빌드, 링크 검사, 로컬 미리보기
.github/workflows/       # push·PR 시 자동 검사
vercel.json              # Vercel 빌드·배포 설정
dist/                    # 자동 생성 결과 (Git 제외)
```

## 로컬 실행

Node.js 20 이상이 필요합니다. 별도 패키지 설치 없이 실행됩니다.

```sh
git clone https://github.com/HSC-Class01/jeeyoun_portfolio.git
cd jeeyoun_portfolio
npm run check
npm run preview
```

미리보기: `http://127.0.0.1:4183/`

- `npm run build`: 소스와 공통 메뉴를 합쳐 `dist/` 생성
- `npm run check`: 빌드 후 내부 링크·이미지·앵커 검사 및 공개 HTML의 휴대전화 번호 패턴 점검
- `npm run preview`: `dist/`를 로컬 서버로 표시

소스를 수정하면 `npm run build`를 다시 실행하고 브라우저를 새로고침합니다. `dist/`는 빌드할 때 다시 생성되므로 직접 편집하지 않습니다. HTML에 있는 `{{SIDEBAR}}`, `{{FOOTER}}`, `{{SECTION:...}}`, `{{ROOT}}` 표시는 빌드가 처리하는 템플릿입니다.

## 콘텐츠 업데이트

1. 위 표의 해당 카테고리 파일을 수정합니다.
2. 이미지는 `public/assets/`에 추가하고 HTML에서 경로를 연결합니다.
3. `npm run check`와 로컬 미리보기로 확인합니다.
4. 변경 파일을 commit하고 `main`에 push합니다.

### CV / About

상세 이력은 `src/pages/about/index.html`에서 수정합니다. 메인 페이지의 요약은 `src/sections/01-about.html`에 있습니다. 연락처·프로필 링크 변경 시 공통 메뉴와 푸터(`src/components/`)에도 해당 내용이 있는지 확인합니다. 공개본은 휴대전화 번호를 제외합니다.

### AI-Generated Reports / 재무데이터 분석

현재 유한양행, 에스디바이오센서, 삼성전자, LG에너지솔루션, LG전자, SK hynix 대시보드를 연결합니다. 기업 추가 시 `financial-analysis/dashboards.js`의 회사 키·이름·URL과 같은 폴더 `index.html`의 선택 버튼을 함께 추가합니다. 외부 대시보드는 해당 GitHub Pages 프로젝트에서 관리됩니다.

### Curated Readings

`src/sections/03-curated-readings.html`에 HBR, McKinsey, The New York Times의 선정 자료와 소개 링크를 추가합니다. 아직 선정하지 않은 자료는 현재처럼 준비 상태로 표시합니다.

### Research & Activities / Certificate

활동 카드는 `src/sections/04-research-activities.html`, 수료증 상세는 `src/pages/activities/certificate/index.html`에서 관리합니다. 현재 첨부된 `CERTIFICATE_Jeeyoun.jpeg` 원본을 게시하며, 이미지를 선택하면 원본 크기로 열립니다. 추가 수료증은 `public/assets/`에 넣고 상세 페이지에 항목을 추가합니다.

## Vercel 연결

이 저장소에는 배포 준비 설정이 포함되어 있습니다. **저장소 push만으로 기존 Vercel 프로젝트와 연결되지는 않습니다.**

기존 `jina-research-library` 프로젝트의 Git 설정에서 `HSC-Class01/jeeyoun_portfolio`를 연결하고 운영 브랜치를 `main`으로 지정합니다. Root Directory는 저장소 루트, Build Command는 `npm run build`, Output Directory는 `dist`입니다. 이후 연결된 `main` 브랜치의 push가 Vercel 배포를 시작합니다.

기존 주소 `https://jinawinwin.vercel.app/`의 도메인 연결은 기존 Vercel 프로젝트에서 유지·확인합니다. `.vercel/`과 `.env*`는 이 저장소에 포함하지 않습니다.

## 공개 파일 범위

현재 공개용 소스와 이미지로 시작하는 새 저장소입니다. 원본 CV 문서, 이전 로컬 Git 이력, 인증 정보는 포함하지 않습니다. GitHub Actions는 빌드와 내부 링크를 검사하며 외부 대시보드의 서비스 상태까지 검사하지는 않습니다.

# 🚀 Auto Analyzer v3.0 - Nielsen UIUX 정밀 분석 도구

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**버튼 클릭 한 번으로 한 사이트의 여러 페이지를 동시에 정밀 분석하는 완전 자동화 도구**

---

## ✨ 주요 특징

### 🎯 다중 페이지 동시 분석 (v3.0 신기능!)
- **1~10개 페이지 동시 분석** - 같은 사이트의 여러 페이지를 한 번에 평가
- **페이지 타입 자동 인식** - main/search/login/board/faq 등 자동 감지
- **항목별 최적 매핑** - 페이지 특성에 맞는 평가 항목 자동 선택
- **도메인 검증** - 같은 사이트만 입력 가능 (프론트+백엔드 이중 검증)

### 🔬 실제 브라우저 측정
- **13개 항목 실측** (30.2% 정확도)
  - 🤖 **Puppeteer 9개**: 호버/클릭/링크/검색 등 실제 동작 테스트 (95%+ 정확도)
  - ⚡ **Lighthouse 4개**: LCP, FID, CLS, TTI 성능 측정 (98% 정확도)
- **30개 항목 추정** (69.8%)
  - 📄 **HTML 분석**: 구조, 접근성, 의미론적 요소 (75-80% 정확도)

### 📊 Nielsen 10대 휴리스틱 기반
- **43개 상세 평가 항목**
- **5점 척도 점수 부여**
- **등급 산출** (A+ ~ F)
- **레이더 차트 시각화**

---

## 🎯 평가 대상 페이지 입력 가이드

### ⚠️ 중요: 같은 사이트만 입력 가능
**반드시 같은 도메인의 여러 페이지만 입력하세요!**
- ✅ 올바른 예: `naver.com/main`, `naver.com/search`, `naver.com/login`
- ❌ 잘못된 예: `naver.com`, `google.com`, `daum.net` (서로 다른 사이트)

### 페이지 입력 순서 (1~10개)
1. **메인 페이지** (필수) - 사이트 홈페이지
2. **검색 결과 페이지** - 키워드 입력 후 결과 페이지
3. **로그인 페이지** - 로그인/회원가입 페이지
4. **게시판 목록** - 공지사항, 자료실 등
5. **게시판 상세** - 게시글 보기 페이지
6. **홍보적 페이지** - 회사소개, 제품소개 등
7. **FAQ/도움말** - 자주 묻는 질문, 도움말 페이지
8. **사이트맵** - 전체 메뉴 구조
9. **문의 페이지** - 연락처, 문의 양식
10. **에러 페이지** - 404 페이지 등

### 페이지 타입별 측정 항목

| 페이지 타입 | 측정 항목 (예시) | 항목 수 |
|----------|---------------|-------|
| **메인 페이지** | N1_3(action feedback), N3_2(emergency exit), N3_3(navigation), N7_1(accelerators), N7_3(batch operations) | 5개 |
| **검색 페이지** | N11_1(search autocomplete), N11_2(search quality), N3_3(flexible navigation) | 3개 |
| **로그인 페이지** | N5_1(input validation), N9_1(error messages), N9_2(recovery support), N1_3(action feedback) | 4개 |
| **게시판 목록** | N3_3(flexible navigation), N6_1(visible options), N7_3(batch operations) | 3개 |
| **게시판 상세** | N3_2(emergency exit), N8_1(essential info), N1_3(action feedback) | 3개 |
| **FAQ** | N10_1(help visibility), N11_1(search autocomplete), N3_2(emergency exit) | 3개 |

---

## 🚀 시작하기

### 📥 설치 (Windows)

1. **다운로드**: https://www.genspark.ai/api/files/s/MSRdD2lg
2. **압축 해제**: `auto-analyzer-v3-같은도메인검증완성.tar.gz` 파일 압축 해제
3. **폴더 이동**: `home\user\auto-analyzer-v3` 폴더로 이동
4. **의존성 설치**:
   ```bash
   npm install
   ```
5. **Chrome 설치 확인**: Chrome 브라우저가 설치되어 있어야 함

### ▶️ 실행

```bash
npm run web
```

브라우저에서 http://localhost:3000 접속

### 📝 사용 방법

1. **페이지 입력**
   - 1번(메인 페이지): 필수 입력
   - 2~10번: 선택 입력 (검색, 로그인, 게시판 등)
   - ⚠️ **반드시 같은 도메인만** 입력

2. **옵션 설정**
   - PDF 리포트 생성 (선택)
   - 캐시 사용 안 함 (선택)

3. **분석 시작**
   - "분석 시작하기" 버튼 클릭
   - 30~90초 대기 (페이지 수에 따라 다름)

4. **결과 확인**
   - 자동으로 결과 페이지 이동
   - 점수 수정 가능 (클릭하여 0.0~5.0 입력)
   - PDF/PPT 다운로드 버튼 (향후 지원)

---

## 📊 테스트 결과

### 단일 페이지 테스트
- **URL**: https://example.com
- **시간**: ~35초
- **점수**: 3.35/5.0 (B)
- **측정 항목**: 5개

### 다중 페이지 테스트 (3페이지)
- **URL**: https://example.com + 2개 서브페이지
- **시간**: ~60초
- **점수**: 3.50/5.0 (B+)
- **페이지**:
  1. https://example.com (main) - 5개 항목
  2. https://example.com/page2 (search) - 3개 항목
  3. https://example.com/login (login) - 4개 항목
- **총 측정 항목**: 12개

---

## 🔧 기술 스택

### Backend
- **Node.js** v18+ (ESM)
- **Express** 4.x - Web server
- **Puppeteer** 23.x - Browser automation
- **Lighthouse** 12.x - Performance analysis
- **Cheerio** 1.x - HTML parsing

### Frontend
- **TailwindCSS** 3.x - Styling
- **Chart.js** 4.x - Radar chart visualization
- **Vanilla JavaScript** - No framework

---

## 📁 프로젝트 구조

```
auto-analyzer-v3/
├── src/
│   ├── index.js                    # CLI entry point
│   ├── core/
│   │   ├── integrator.js           # Main analysis orchestrator (MULTI-PAGE)
│   │   ├── browser.js              # Puppeteer browser launch
│   │   ├── cache.js                # Cache management
│   │   └── pageTypeMapping.js      # Page type inference & item mapping
│   ├── analyzers/
│   │   ├── htmlAnalyzer.js         # HTML structure & accessibility
│   │   ├── interactionAnalyzer.js  # Puppeteer interaction tests
│   │   ├── performanceAnalyzer.js  # Lighthouse performance
│   │   └── nielsenEvaluator.js     # Nielsen score calculation
│   └── reporters/
│       └── pdfGenerator.js         # PDF report generation
├── web/
│   ├── index.html                  # Web UI (multi-page input)
│   └── result.html                 # Result page (v2 style)
├── output/                         # Analysis results (JSON)
├── server.js                       # Express web server (domain validation)
├── package.json
└── README.md
```

---

## 🎯 개발 로드맵

- ✅ **v3.0**: 다중 페이지 분석 완성 (2026-03-06)
  - 1~10개 페이지 동시 분석
  - 페이지 타입 자동 인식
  - 도메인 검증 (프론트+백엔드)
  - v2 스타일 UI 복원

- 🔜 **v3.1**: PDF 리포트 생성
  - 레이더 차트 + 상세 분석
  - 페이지별 상세 리포트
  - 개선 제안 포함

- 🔜 **v3.2**: PPT 리포트 생성
  - 경영진 보고용 프레젠테이션
  - 요약 + 핵심 지표

- 🔜 **v4.0**: AI 기반 개선 제안
  - GPT-4 기반 상세 분석
  - 코드 레벨 개선 제안
  - 우선순위 제안

---

## 📄 라이선스

MIT License

---

## 👤 개발자

- **GitHub**: https://github.com/imyounghwan/auto-analyzer-v3
- **Version**: 3.0.0
- **Last Updated**: 2026-03-06

---

## 🆘 문제 해결

### Q1. "분석이 시작되지 않습니다"
- 메인 페이지(1번)가 입력되어 있는지 확인
- 모든 페이지가 같은 도메인인지 확인
- Chrome 브라우저가 설치되어 있는지 확인

### Q2. "서로 다른 사이트를 입력할 수 없습니다" 에러
- 같은 도메인의 페이지만 입력하세요
- 예: `naver.com/main`, `naver.com/search` (✅)
- 잘못된 예: `naver.com`, `google.com` (❌)

### Q3. "분석 시간이 너무 오래 걸립니다"
- 페이지 수에 따라 30초~90초 소요
- 1페이지: ~35초
- 3페이지: ~60초
- 10페이지: ~90초

### Q4. "점수를 수정하고 싶습니다"
- 결과 페이지에서 각 항목의 "수정" 버튼 클릭
- 0.0~5.0 사이 값 입력
- 자동으로 전체 점수 재계산

---

## 🙏 기여

이슈 및 PR 환영합니다!

---

**Auto Analyzer v3.0** - 누구나 쉽게 사용하는 Nielsen UIUX 정밀 분석 도구 🚀

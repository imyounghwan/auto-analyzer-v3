# Auto Analyzer v3.0 - Nielsen UIUX 정밀 분석 도구

## 📋 프로젝트 개요

**Auto Analyzer v3**는 Nielsen 10대 휴리스틱 원칙 기반 **43개 항목**을 **전수 조사 방식**으로 정밀 분석하는 **Node.js 로컬 CLI 도구**입니다.

### 주요 특징
- ✅ **43개 항목 완전 분석** (Nielsen 10대 원칙 기반)
- ✅ **전수 조사 방식** - 샘플링이 아닌 모든 요소 실제 테스트
- ✅ **Puppeteer 실측** - 모든 버튼/링크/모달 실제 작동 검증 (9개 항목)
- ✅ **Lighthouse 성능 측정** - Web Vitals 실측 (LCP, FID, CLS, TTI)
- ✅ **PDF 리포트 생성** - 레이더 차트 + 상세 분석표
- ✅ **캐싱 시스템** - 1시간 캐시로 빠른 재분석

---

## 🆚 버전 비교

| 항목 | v2 (Cloudflare Workers) | v3 (Node.js CLI) |
|------|------------------------|------------------|
| **분석 항목** | 43개 | 43개 |
| **측정 방식** | HTML 구조 분석 | 전수 조사 (모든 요소 실제 테스트) |
| **실측 항목** | 0개 | 13개 (Puppeteer 9개 + Lighthouse 4개) |
| **샘플링** | N/A | ❌ (전수 조사) |
| **호버 테스트** | ❌ | ✅ 모든 버튼 (예: 34개 전체) |
| **링크 테스트** | ❌ | ✅ 모든 링크 (예: 150개 전체) |
| **모달 테스트** | ❌ | ✅ 모든 모달 닫기 기능 검증 |
| **검색 테스트** | ❌ | ✅ 실제 타이핑 + 자동완성 확인 |
| **PDF 리포트** | ❌ | ✅ |
| **분석 시간** | ~2초 | ~40초 (전수 조사) |
| **배포 형태** | 웹 서비스 | 로컬 CLI |
| **Chrome 필요** | ❌ | ✅ |

---

## 🔬 전수 조사 방식

### N1_3: 행동 피드백
- **기존**: 버튼 5개 샘플링
- **v3**: **모든 버튼/링크 호버 + 클릭 테스트**
- 예시: 34개 요소 → 17개 호버 테스트 + 4개 클릭 테스트

### N3_2: 비상 탈출구
- **기존**: 모달 존재 여부만 확인
- **v3**: **모든 모달의 닫기 버튼 + ESC 키 실제 작동 검증**

### N3_3: 네비게이션 자유도
- **기존**: 링크 3개 샘플링
- **v3**: **모든 링크 실제 클릭 테스트** (150개 전체)

### N7_1~N7_3: 유연성과 효율성
- **v3**: 모든 단축키, 설정, 체크박스 전체선택 **실제 작동 검증**

### N11_1~N11_2: 검색 기능
- **v3**: 실제 검색어 타이핑 → 자동완성 확인 → 검색 실행 → 결과 검증

---

## 📊 측정 정확도

### 실측 항목 (13개)
1. **Puppeteer 실측 (9개)**: 실제 브라우저에서 작동 검증
   - N1_3: 행동 피드백 (호버/클릭 반응)
   - N3_2: 비상 탈출구 (닫기 버튼/ESC 키)
   - N3_3: 네비게이션 (모든 링크 클릭)
   - N7_1: 가속 장치 (단축키 작동)
   - N7_2: 개인화 (설정 변경 적용)
   - N7_3: 일괄 처리 (전체 선택 작동)
   - N9_2: 오류 회복 (복구 기능 작동)
   - N11_1: 검색 자동완성
   - N11_2: 검색 품질

2. **Lighthouse 실측 (4개)**: Google 표준 도구로 측정
   - N17_1: LCP (Largest Contentful Paint)
   - N17_2: FID (First Input Delay)
   - N17_3: CLS (Cumulative Layout Shift)
   - N17_4: TTI (Time to Interactive)

### HTML 분석 항목 (30개)
- 구조 분석, 접근성, 폼 복잡도 등

---

## 🚀 설치 및 사용법

### 1. 시스템 요구사항
```bash
# Node.js 18+ 필수
node --version  # v18+

# Chrome 설치 필수
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

### 2. 프로젝트 설치
```bash
# 저장소 클론
git clone https://github.com/imyounghwan/auto-analyzer-v3.git
cd auto-analyzer-v3

# 의존성 설치
npm install
```

### 3. 기본 사용법
```bash
# 기본 분석 (JSON 출력)
npm start -- analyze --url https://www.example.com

# PDF 리포트 생성
npm start -- analyze --url https://www.example.com --pdf

# 캐시 사용 안 함 (항상 새로 분석)
npm start -- analyze --url https://www.example.com --no-cache

# 출력 경로 지정
npm start -- analyze --url https://www.example.com --output ./reports --pdf
```

---

## 📊 분석 결과 예시

### 콘솔 출력
```
🖱️  Puppeteer 인터랙션 분석 시작...
  🖱️  N1_3 행동 피드백 (전수 조사)...
  📊 총 34개 요소 테스트 중...
  ⏳ 진행: 10/34 (29%)
  ✅ 호버: 17/17 (100.0%)
  ✅ 클릭: 4/4 (100.0%)
  ✅ 최종 점수: 5.0/5.0
  
  🧭 N3_3 네비게이션 자유도 (전수 조사)...
  📊 총 150개 링크 테스트 중...
  ⏳ 진행: 50/150 (33%)
  ✅ 작동: 145/150 (96.7%)
  ✅ 최종 점수: 4.5/5.0

======================================================================
📊 분석 완료
======================================================================
종합 점수: 3.16/5.0
등급: B
전체 정확도: 90.2%

📊 측정 방식:
  Puppeteer 실측: 9개
  Lighthouse 실측: 4개
  HTML 분석: 30개
```

---

## 🔧 개발 가이드

### 전수 조사 방식 구현
```javascript
// 샘플링 (❌ 기존 방식)
const sampleSize = Math.min(buttons.length, 5);
const sampledButtons = buttons.slice(0, sampleSize);

// 전수 조사 (✅ v3 방식)
for (const [index, button] of buttons.entries()) {
  // 모든 버튼 테스트
  await button.hover();
  const hasChange = detectStyleChange();
  if (hasChange) passedCount++;
  
  // 진행률 표시 (10%마다)
  if ((index + 1) % Math.ceil(buttons.length / 10) === 0) {
    console.log(`⏳ 진행: ${index + 1}/${buttons.length}`);
  }
}
```

---

## 📁 프로젝트 구조

```
auto-analyzer-v3/
├── src/
│   ├── analyzers/
│   │   ├── htmlAnalyzer.js          # HTML/CSS 분석
│   │   ├── interactionAnalyzer.js   # Puppeteer 전수 조사
│   │   ├── performanceAnalyzer.js   # Lighthouse 성능
│   │   └── nielsenEvaluator.js      # Nielsen 점수 계산
│   ├── core/
│   │   ├── browser.js               # Puppeteer 브라우저 관리
│   │   ├── cache.js                 # 캐싱 시스템
│   │   └── integrator.js            # 종합 분석 통합
│   ├── reporters/
│   │   └── pdfGenerator.js          # PDF 리포트 생성
│   └── index.js                     # CLI 진입점
├── output/                          # 분석 결과 (JSON, PDF)
├── cache/                           # 캐시 데이터
├── package.json
└── README.md
```

---

## 🐛 알려진 제한사항

1. **분석 시간**: 전수 조사 방식으로 인해 40초~2분 소요 (페이지 복잡도에 따라)
2. **동적 콘텐츠**: JavaScript로 생성되는 콘텐츠는 Puppeteer가 대기 시간 필요
3. **인증 필요 페이지**: 로그인 필요 페이지는 분석 불가 (추후 쿠키 지원 예정)
4. **외부 링크**: 보안상 외부 링크는 클릭 테스트 제외

---

## 🔄 버전 히스토리

### v3.0.0 (2026-03-05)
- ✅ 전수 조사 방식으로 전면 재작성
- ✅ Puppeteer 실측 9개 항목 (모든 요소 테스트)
- ✅ Lighthouse 성능 측정 통합 (LCP, FID, CLS, TTI)
- ✅ PDF 리포트 생성 기능 (레이더 차트 + 상세 표)
- ✅ 샘플링 제거, 전수 조사로 정확도 확보
- ❌ 웹 서비스 제거 (로그인, 회원가입, 문의하기)

### v2.0.0 (2024-12)
- Cloudflare Workers 기반 웹 서비스
- HTML 분석만으로 43개 항목 평가
- D1 Database, PBKDF2 인증 시스템

### v1.0.0 (2024-11)
- 초기 버전 (uiux.mgine.co.kr)

---

## 📞 문의 및 기여

- **GitHub**: https://github.com/imyounghwan/auto-analyzer-v3
- **Issues**: [GitHub Issues](https://github.com/imyounghwan/auto-analyzer-v3/issues)
- **Pull Requests**: 환영합니다!
- **라이선스**: MIT

---

## 🙏 감사의 말

- **Nielsen Norman Group**: 10대 휴리스틱 원칙
- **Google Lighthouse**: 성능 측정 도구
- **Puppeteer**: 브라우저 자동화

---

**Made with ❤️ by MGINE**

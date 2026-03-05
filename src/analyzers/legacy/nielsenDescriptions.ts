/**
 * Nielsen 26개 항목 상세 설명 (v3.1 - 사용자 친화적 버전)
 * 전문 용어를 최소화하고 구체적인 예시를 포함
 */

export interface ItemDescription {
  id: string
  name: string
  category: string
  description: string
  principle: string
  why_important: string
  evaluation_criteria: string
}

export const nielsenDescriptions: Record<string, ItemDescription> = {
  'N1_1': {
    id: 'N1.1',
    name: '내가 어디있는지 알려주기',
    category: '편의성',
    principle: 'N1: 시스템 상태 가시성',
    description: '홈 > 회사소개 > 연혁 처럼 현재 페이지의 위치를 보여주는 경로(브레드크럼) 표시',
    why_important: '큰 쇼핑몰에서 길을 잃으면 원하는 매장을 찾기 어렵듯이, 웹사이트에서도 내 위치를 모르면 헤매게 됩니다.',
    evaluation_criteria: '브레드크럼 존재 여부 확인: breadcrumb 클래스, location_wrap, "현재위치" 텍스트, "홈 >" 패턴 등'
  },
  'N1_2': {
    id: 'N1.2',
    name: '로딩중이라고 알려주기',
    category: '편의성',
    principle: 'N1: 시스템 상태 가시성',
    description: '페이지를 불러오는 중이거나 데이터 처리 중일 때 빙글빙글 도는 아이콘이나 "처리중..." 메시지 표시',
    why_important: '아무 반응이 없으면 "고장났나?" 하고 불안해지고, 버튼을 여러 번 누르게 됩니다.',
    evaluation_criteria: '로딩 UI 표시 확인: spinner, progress, skeleton, 로딩 애니메이션, "처리중" 메시지 등'
  },
  'N1_3': {
    id: 'N1.3',
    name: '내 행동에 반응하기',
    category: '편의성',
    principle: 'N1: 시스템 상태 가시성',
    description: '버튼을 누르면 색이 바뀌거나, 입력란에 잘못 입력하면 즉시 "올바른 형식이 아닙니다" 같은 피드백 제공',
    why_important: '버튼을 눌렀는데 아무 변화가 없으면 "내가 잘못 눌렀나?" 하고 혼란스럽습니다.',
    evaluation_criteria: '3차원 액션 피드백: 1) 시각 피드백(hover, focus, active 상태 변화) 2) 청각 피드백(효과음) 3) 상태 피드백(입력 검증 메시지)'
  },
  'N2_1': {
    id: 'N2.1',
    name: '쉬운 말로 쓰기',
    category: '편의성',
    principle: 'N2: 현실 세계 일치',
    description: '"Submit" 대신 "제출하기", "Authentication Failed" 대신 "로그인 실패" 처럼 일상 언어 사용',
    why_important: '전문 용어나 영어는 일반 사용자가 이해하기 어렵고 불편합니다.',
    evaluation_criteria: '언어 친화도: 전문용어 비율, 영어 사용 빈도, 평균 문장 길이, 사용자 중심 언어 vs 시스템 중심 언어'
  },
  'N2_2': {
    id: 'N2.2',
    name: '자연스러운 순서로 배치',
    category: '편의성',
    principle: 'N2: 현실 세계 일치',
    description: '회원가입 시 "이름 → 이메일 → 비밀번호" 순서처럼 예상 가능한 흐름으로 정보 배치',
    why_important: '뒤죽박죽 순서는 "왜 이게 여기있지?" 하며 헷갈리게 만듭니다.',
    evaluation_criteria: '데이터 자연스러움: 날짜 형식 일관성, 정렬 순서, 숫자 표기 형식, 제목-내용 구조 명확성'
  },
  'N2_3': {
    id: 'N2.3',
    name: '직관적인 아이콘 사용',
    category: '디자인',
    principle: 'N2: 현실 세계 일치',
    description: '휴지통 아이콘은 삭제, 돋보기는 검색처럼 현실 물건과 똑같이 생긴 아이콘 사용',
    why_important: '익숙한 모양은 설명 없이도 바로 이해할 수 있어서 편합니다.',
    evaluation_criteria: '은유 사용: 아이콘 개수, 의미 명확성, 통념 일치도(휴지통=삭제, 돋보기=검색 등)'
  },
  'N3_1': {
    id: 'N3.1',
    name: '되돌리기 버튼 제공',
    category: '편의성',
    principle: 'N3: 사용자 제어와 자유',
    description: '긴 폼 작성 중 "초기화" 버튼이나, 잘못 입력한 내용을 "취소" 할 수 있는 기능 제공',
    why_important: '실수를 고칠 방법이 없으면 처음부터 다시 해야 합니다.',
    evaluation_criteria: '1) 모달/팝업 탈출(30%): 닫기 버튼, X 아이콘, ESC 키 지원 2) 다단계 후퇴(25%): 이전 버튼, 브레드크럼 3) 입력 취소/초기화(25%): 폼 리셋, 필터 초기화 4) 파괴적 행동 방지(20%): 삭제 시 확인 절차'
  },
  'N3_3': {
    id: 'N3_3',
    name: '여러 길로 갈 수 있게 하기',
    category: '편의성',
    principle: 'N3: 사용자 제어와 자유',
    description: '고객센터를 상단메뉴, 하단링크, 검색 등 여러 방법으로 찾아갈 수 있도록 구성',
    why_important: '한 가지 길만 있으면 그 길을 놓치면 막막합니다.',
    evaluation_criteria: '다중 경로: 주요 페이지(홈, 고객센터, 검색 등)로 가는 링크가 상단/하단/사이드바 등 여러 곳에 존재'
  },
  'N4_1': {
    id: 'N4.1',
    name: '통일된 디자인',
    category: '디자인',
    principle: 'N4: 일관성과 표준',
    description: '모든 페이지에서 같은 색상, 같은 폰트, 같은 버튼 스타일 사용',
    why_important: '페이지마다 디자인이 다르면 매번 새로 익혀야 해서 피곤합니다.',
    evaluation_criteria: '시각적 일관성: 색상 패턴 수, 버튼 스타일 종류, 폰트 패밀리 수, 레이아웃 구조 통일성'
  },
  'N4_2': {
    id: 'N4.2',
    name: '같은 말로 통일하기',
    category: '편의성',
    principle: 'N4: 일관성과 표준',
    description: '"로그인"을 어떤 페이지에선 "로그인", 다른 페이지에선 "Sign In"으로 부르지 않고 하나로 통일',
    why_important: '같은 기능을 다르게 부르면 "이게 다른 건가?" 하고 사용자는 혼란스럽습니다.',
    evaluation_criteria: '용어 일관성: 중복 용어 비율, 혼용 패턴(로그인/Sign In), 번역 일관성'
  },
  'N4_3': {
    id: 'N4.3',
    name: '웹 표준 지키기',
    category: '편의성',
    principle: 'N4: 일관성과 표준',
    description: '이미지에 설명글(alt) 추가, 페이지 언어(한국어) 명시 등 웹 기본 규칙 준수',
    why_important: '표준을 안 지키면 시각장애인용 화면낭독기 같은 보조도구가 제대로 작동하지 않습니다.',
    evaluation_criteria: '웹 표준: HTML 검증, alt 텍스트 존재, lang 속성, ARIA 레이블, 시맨틱 태그 사용'
  },
  'N5_1': {
    id: 'N5.1',
    name: '잘못된 입력 미리 막기',
    category: '편의성',
    principle: 'N5: 오류 예방',
    description: '이메일 입력란에 숫자만 입력하면 "올바른 이메일이 아닙니다" 즉시 표시, 필수항목 빈칸 제출 차단',
    why_important: '잘못 입력하고 제출한 뒤 오류를 확인하는 것보다, 입력 중에 미리 알려주는 게 편합니다.',
    evaluation_criteria: '입력 검증: required 속성, pattern 정규식, type 제한(email, number 등), min/max 범위'
  },
  'N5_2': {
    id: 'N5.2',
    name: '중요한 작업은 재확인',
    category: '편의성',
    principle: 'N5: 오류 예방',
    description: '삭제, 결제 같은 중요한 버튼 누르면 "정말 삭제하시겠습니까?" 재확인 팝업 표시',
    why_important: '실수로 눌러서 돌이킬 수 없는 일이 생길 수 있습니다.',
    evaluation_criteria: '확인 절차: confirm 대화상자, modal 확인창, 2단계 확인, "정말 삭제하시겠습니까?" 메시지'
  },
  'N5_3': {
    id: 'N5.3',
    name: '입력 조건 미리 알려주기',
    category: '편의성',
    principle: 'N5: 오류 예방',
    description: '비밀번호 입력란 옆에 "8자 이상, 영문+숫자 조합" 같은 조건을 미리 표시',
    why_important: '규칙을 모르고 입력했다가 오류가 나면 다시 입력해야 해서 번거롭습니다.',
    evaluation_criteria: '입력 가이드: placeholder 힌트, label 설명, 조건 명시(8자 이상), 예시 제공'
  },
  'N6_2': {
    id: 'N6.2',
    name: '아이콘으로 기능 표시',
    category: '편의성',
    principle: 'N6: 인식보다 회상',
    description: '프린터 아이콘만 봐도 "인쇄" 기능인 걸 알 수 있도록 시각적 힌트 제공',
    why_important: '"이 버튼이 뭐였지?" 하고 기억해내려 애쓰는 것보다 보고 바로 아는 게 편합니다.',
    evaluation_criteria: '시각적 힌트: 아이콘+텍스트 조합, title 속성, 툴팁, aria-label'
  },
  'N6_3': {
    id: 'N6.3',
    name: '기억할 것 최소화',
    category: '편의성',
    principle: 'N6: 인식보다 회상',
    description: '여러 단계 작업 시 이전 단계 정보를 화면에 계속 보여줘서 기억하지 않아도 되게 하기',
    why_important: '머릿속으로 기억하면서 사용하면 실수하기 쉽고 피곤합니다.',
    evaluation_criteria: '상태 유지: 브레드크럼, 진행 표시기, 선택 상태 하이라이트, 이전 입력값 유지'
  },
  'N7_1': {
    id: 'N7.1',
    name: '가속 장치',
    category: '편의성',
    principle: 'N7: 유연성과 효율성',
    description: '키보드 단축키, 빠른 메뉴, 최근 이용 기록 등 숙련자를 위한 효율적인 작업 수단 제공',
    why_important: '반복 작업이 많은 숙련자는 빠른 접근 수단이 없으면 불편합니다.',
    evaluation_criteria: '단축키: accesskey 속성, tabindex 순서, 키보드 이벤트(Ctrl+S 등), 빠른 메뉴'
  },
  'N7_2': {
    id: 'N7.2',
    name: '개인화',
    category: '편의성',
    principle: 'N7: 유연성과 효율성',
    description: '설정 개인화, 글자 크기 조절, 다크모드/테마, 언어 선택 등 사용자 맞춤 기능 제공',
    why_important: '사용자마다 선호하는 환경이 다르므로 개인화 기능이 필요합니다.',
    evaluation_criteria: '커스터마이징: 테마 변경(다크모드), 폰트 크기 조절, 레이아웃 변경, 언어 선택'
  },
  'N7_3': {
    id: 'N7.3',
    name: '일괄 처리',
    category: '편의성',
    principle: 'N7: 유연성과 효율성',
    description: '전체 선택, 일괄 삭제/다운로드/수정 등 여러 항목을 한 번에 처리하는 기능 제공',
    why_important: '항목을 하나씩 처리하는 것은 비효율적이고 시간이 오래 걸립니다.',
    evaluation_criteria: '일괄 처리: checkbox 전체 선택, 일괄 삭제/다운로드/수정 버튼, 선택 항목 개수 표시'
  },
  'N8_1': {
    id: 'N8.1',
    name: '필요한 정보만 보여주기',
    category: '디자인',
    principle: 'N8: 미니멀 디자인',
    description: '한 페이지에 너무 많은 내용을 담지 않고, 핵심만 간결하게 표시',
    why_important: '정보가 너무 많으면 정작 중요한 걸 못 찾고 포기합니다.',
    evaluation_criteria: '정보 밀도: 총 문단 수, 총 문자 수, 군더더기 비율, 핵심 정보 집중도'
  },
  'N8_2': {
    id: 'N8.2',
    name: '깔끔하고 여유있게',
    category: '디자인',
    principle: 'N8: 미니멀 디자인',
    description: '이미지, 버튼, 글자 사이에 적당한 여백을 두어 답답하지 않게 구성',
    why_important: '빽빽하게 채우면 눈이 피곤하고 어디를 봐야 할지 모릅니다.',
    evaluation_criteria: '3축 인터페이스: 1) 정보 처리 부담(40%): 긴 문단, 액션 밀도 2) 시각적 호흡(35%): 섹션 수, DOM 복잡도 3) 시각적 노이즈(25%): 방해 요소, 애니메이션'
  },
  'N8_3': {
    id: 'N8.3',
    name: '정보 찾기 쉽게',
    category: '디자인',
    principle: 'N8: 미니멀 디자인',
    description: '헤딩 간격, 구조, 강조 분포로 사용자가 정보를 쉽게 스캔하고 찾을 수 있게 구성',
    why_important: '헤딩이 없거나 텍스트가 빽빽하면 어디서부터 읽어야 할지 모르고 포기합니다.',
    evaluation_criteria: '1) 스캔 앵커(45%): 헤딩 간격, 첫 화면 헤딩, 연속 텍스트 블록 길이 2) 헤딩 구조(35%): 헤딩 수, 계층 건너뛰기 여부 3) 강조 분포(20%): 강조 요소 비율'
  },
  'N9_2': {
    id: 'N9.2',
    name: '오류 발생시 복구 지원',
    category: '편의성',
    principle: 'N9: 오류 인식과 복구',
    description: '오류 나도 입력한 내용이 그대로 남아있어서 처음부터 다시 안 해도 됨',
    why_important: '오류 발생시 데이터가 사라지면 사용자는 아예 사용을 그만하게 됩니다.',
    evaluation_criteria: '3단계 오류 회복: 1) 인식(30점): 오류 강조, 위치 표시 2) 진단(40점): 원인 설명 3) 복구(30점): 입력값 유지, 수정 가이드'
  },
  'N9_4': {
    id: 'N9.4',
    name: '오류 원인 명확하게 설명',
    category: '편의성',
    principle: 'N9: 오류 인식과 복구',
    description: '"오류 발생" 대신 "비밀번호는 8자 이상이어야 합니다" 처럼 구체적인 해결방법 제시',
    why_important: '무슨 문제인지 모르면 어떻게 고쳐야 할지 알 수 없습니다.',
    evaluation_criteria: '오류 진단 품질: 1) 사용자 언어(20점): 전문용어 회피 2) 구체적 원인(15점): 무엇이 문제인지 3) 해결 방법(5점): 어떻게 고칠지'
  },
  'N10_1': {
    id: 'N10.1',
    name: '도움말 찾기 쉽게',
    category: '편의성',
    principle: 'N10: 도움말과 문서',
    description: 'FAQ, 도움말 버튼이 페이지 상단이나 하단에 항상 보이는 위치에 있음',
    why_important: '모를 때 도움말을 못 찾으면 답답해서 포기합니다.',
    evaluation_criteria: '도움말 가시성: 위치(상단/하단/고정), 개수(메인/서브 페이지), 접근성(클릭 거리)'
  },
  'N10_2': {
    id: 'N10.2',
    name: '체계적인 도움말 문서',
    category: '편의성',
    principle: 'N10: 도움말과 문서',
    description: 'FAQ가 주제별로 정리되어 있고, 가이드 문서가 단계별로 잘 설명됨',
    why_important: '도움말이 뒤죽박죽이면 찾기 어렵고 이해하기 힘듭니다.',
    evaluation_criteria: '도움말 구조: 카테고리 분류, 검색 기능, 단계별 가이드, 스크린샷/동영상 포함'
  },
  // N11: 검색 기능 (2개 항목)
  'N11_1': {
    id: 'N11.1',
    name: '검색 자동완성',
    category: '편의성',
    principle: 'N11: 검색 기능',
    description: '검색창에 글자를 입력할 때 자동으로 추천 검색어나 관련 결과를 보여주는 기능',
    why_important: '검색어를 다 입력하지 않아도 원하는 항목을 빠르게 찾을 수 있어 편리합니다.',
    evaluation_criteria: 'HTML 검색 요소: type="search", role="search", <datalist>, autocomplete 속성, 검색 결과 목록 등'
  },
  'N11_2': {
    id: 'N11.2',
    name: '검색 결과 품질',
    category: '편의성',
    principle: 'N11: 검색 기능',
    description: '검색 결과가 관련성 높은 순서로 정렬되고, 필터나 정렬 옵션이 제공됨',
    why_important: '좋은 검색 결과가 나오지 않으면 사용자는 원하는 정보를 찾지 못하고 포기합니다.',
    evaluation_criteria: '검색 기능: 검색 필드 존재 여부, 필터/정렬 옵션, 결과 개수 표시 등'
  },
  // N12: 반응형 디자인 (2개 항목)
  'N12_1': {
    id: 'N12.1',
    name: '반응형 레이아웃',
    category: '편의성',
    principle: 'N12: 반응형 디자인',
    description: '모바일, 태블릿, PC 등 다양한 화면 크기에 맞게 레이아웃이 자동으로 조정됨',
    why_important: '화면 크기에 맞지 않으면 가로 스크롤이 생기거나 글자가 너무 작아져서 불편합니다.',
    evaluation_criteria: 'viewport 메타태그, CSS 미디어쿼리(@media), 유동적 레이아웃 사용 여부'
  },
  'N12_2': {
    id: 'N12.2',
    name: '터치 최적화',
    category: '편의성',
    principle: 'N12: 반응형 디자인',
    description: '모바일 환경에서 버튼이나 링크의 클릭 영역이 충분히 커서 손가락으로 쉽게 누를 수 있음',
    why_important: '터치 영역이 작으면 원하는 버튼을 못 누르고 다른 버튼을 잘못 눌러 불편합니다.',
    evaluation_criteria: '터치 타겟 크기: 최소 44x44px 권장, 버튼 간격, 모바일 친화적인 인터랙션'
  },
  // N13: 콘텐츠 신선도
  'N13': {
    id: 'N13',
    name: '콘텐츠 신선도',
    category: '편의성',
    principle: 'N13: 콘텐츠 신선도',
    description: '페이지에 최신 정보가 표시되고, 작성일이나 업데이트 날짜가 명시됨',
    why_important: '오래된 정보는 더 이상 유효하지 않을 수 있어 신뢰성이 떨어집니다.',
    evaluation_criteria: '<time> 태그, datetime 속성, 최근 연도(2024-2026) 언급, 업데이트 날짜 표시'
  },
  // N14: 접근성 개선 (2개 항목)
  'N14_1': {
    id: 'N14.1',
    name: '색상 대비',
    category: '편의성',
    principle: 'N14: 접근성 개선',
    description: '텍스트와 배경색의 명도 차이가 충분해서 가독성이 좋음 (최소 4.5:1 대비 권장)',
    why_important: '대비가 낮으면 시력이 약한 사람이나 밝은 햇빛 아래에서 글자를 읽기 어렵습니다.',
    evaluation_criteria: 'WCAG 기준 색상 대비율(4.5:1 이상), 명도 차이, ARIA 레이블 개수'
  },
  'N14_2': {
    id: 'N14.2',
    name: '키보드 접근성',
    category: '편의성',
    principle: 'N14: 접근성 개선',
    description: '마우스 없이 키보드만으로도 모든 기능을 사용할 수 있음 (Tab, Enter, 화살표 키 등)',
    why_important: '마우스를 사용하기 어려운 사람이나 키보드만 사용하는 전문가에게 필수적입니다.',
    evaluation_criteria: 'tabindex 설정, accesskey 속성, 건너뛰기 링크, 키보드 포커스 표시'
  },
  // N15: 파일 다운로드
  'N15': {
    id: 'N15',
    name: '파일 다운로드',
    category: '편의성',
    principle: 'N15: 파일 다운로드',
    description: 'PDF, ZIP 등 파일 다운로드 기능이 명확하게 제공되고, download 속성이 설정됨',
    why_important: '다운로드 기능이 없거나 불명확하면 사용자가 필요한 자료를 받을 수 없습니다.',
    evaluation_criteria: 'download 속성, .pdf/.zip 링크, 다운로드 버튼 존재 여부'
  },
  // N16: 폼 복잡도
  'N16': {
    id: 'N16',
    name: '폼 복잡도',
    category: '편의성',
    principle: 'N16: 폼 복잡도',
    description: '입력 폼이 너무 길지 않고, 필수 항목이 적절하게 제한되어 있음',
    why_important: '입력할 항목이 너무 많으면 사용자가 중간에 포기하거나 잘못 입력할 가능성이 높습니다.',
    evaluation_criteria: '입력 필드 개수: 5개 이하(5.0점), 6-10개(4.5점), 11-15개(3.5점), 16개 이상(2.5점 이하)'
  },
  // N17: 성능 지표 (4개 항목)
  'N17_1': {
    id: 'N17.1',
    name: 'LCP 성능 (Largest Contentful Paint)',
    category: '편의성',
    principle: 'N17: 성능 지표',
    description: '페이지의 가장 큰 콘텐츠(이미지, 텍스트 블록)가 화면에 나타나는 속도 (2.5초 이내 권장)',
    why_important: '페이지가 느리게 로드되면 사용자는 기다리지 않고 떠납니다.',
    evaluation_criteria: 'LCP < 2.5초(5.0점), < 4초(3.5점), 그 이상(2.5점); 이미지 개수 기반 추정'
  },
  'N17_2': {
    id: 'N17.2',
    name: 'FID 반응성 (First Input Delay)',
    category: '편의성',
    principle: 'N17: 성능 지표',
    description: '사용자가 처음 클릭이나 탭을 했을 때 브라우저가 반응하는 속도 (100ms 이내 권장)',
    why_important: '클릭했는데 반응이 느리면 "고장났나?" 하고 다시 클릭해서 오류가 발생합니다.',
    evaluation_criteria: 'FID < 100ms(5.0점), < 300ms(3.5점), 그 이상(2.5점); 입력 필드 개수 기반 추정'
  },
  'N17_3': {
    id: 'N17.3',
    name: 'CLS 안정성 (Cumulative Layout Shift)',
    category: '편의성',
    principle: 'N17: 성능 지표',
    description: '페이지 로딩 중 레이아웃이 갑자기 밀리거나 이동하지 않음 (0.1 이하 권장)',
    why_important: '글을 읽다가 갑자기 내용이 밀려서 다른 버튼을 잘못 누르게 됩니다.',
    evaluation_criteria: 'CLS < 0.1(5.0점), < 0.25(3.5점), 그 이상(2.5점); 이미지 alt 비율 기반 추정'
  },
  'N17_4': {
    id: 'N17.4',
    name: 'TTI 인터랙티브 (Time to Interactive)',
    category: '편의성',
    principle: 'N17: 성능 지표',
    description: '페이지가 완전히 상호작용 가능한 상태가 되는 시간 (3.8초 이내 권장)',
    why_important: '페이지가 보여도 클릭이 안 되면 사용자는 불안하고 답답합니다.',
    evaluation_criteria: 'TTI < 3.8초(5.0점), < 7.3초(3.5점), 그 이상(2.5점); 링크 개수 기반 추정'
  },
  // N18: 다국어 지원
  'N18': {
    id: 'N18',
    name: '다국어 지원',
    category: '편의성',
    principle: 'N18: 다국어 지원',
    description: '영어, 중국어 등 여러 언어로 콘텐츠를 제공하거나, 언어 전환 버튼이 있음',
    why_important: '외국인 사용자도 자신의 언어로 콘텐츠를 볼 수 있어 접근성이 향상됩니다.',
    evaluation_criteria: 'lang 속성, hreflang 링크, 언어 관련 키워드, 언어 전환 버튼'
  },
  // N19: 알림 시스템
  'N19': {
    id: 'N19',
    name: '알림 시스템',
    category: '편의성',
    principle: 'N19: 알림 시스템',
    description: '중요한 메시지나 업데이트를 토스트(toast) 알림이나 배너로 명확하게 표시',
    why_important: '중요한 정보를 놓치면 사용자가 시스템 상태를 제대로 파악하지 못합니다.',
    evaluation_criteria: '알림 요소: toast, notification, alert 키워드, ARIA role="alert", 알림 기능 구현'
  },
  // N20: 브랜딩
  'N20': {
    id: 'N20',
    name: '브랜딩',
    category: '편의성',
    principle: 'N20: 브랜딩',
    description: '로고, 브랜드 컬러, 브랜드명이 명확하게 표시되어 사이트의 정체성을 알 수 있음',
    why_important: '브랜딩이 명확하지 않으면 사용자가 어떤 사이트인지 신뢰하기 어렵습니다.',
    evaluation_criteria: 'logo 키워드, 브랜드/저작권 언급, theme-color 메타태그, primary-color 설정'
  }
}

/**
 * 항목 ID로 설명 가져오기
 */
export function getItemDescription(itemId: string): ItemDescription | null {
  return nielsenDescriptions[itemId] || null
}

/**
 * 모든 항목 설명 가져오기
 */
export function getAllDescriptions(): ItemDescription[] {
  return Object.values(nielsenDescriptions)
}

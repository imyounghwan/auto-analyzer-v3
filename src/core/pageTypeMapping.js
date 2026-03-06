// 페이지 타입별 분석 항목 매핑

/**
 * 페이지 타입 정의
 */
export const PAGE_TYPES = {
  MAIN: 'main',           // 메인 페이지
  SEARCH: 'search',       // 검색 결과 페이지
  LOGIN: 'login',         // 로그인 페이지
  BOARD_LIST: 'board_list', // 게시판 목록
  BOARD_DETAIL: 'board_detail', // 게시판 상세
  PROMO: 'promo',         // 홍보 페이지
  FAQ: 'faq',             // FAQ/도움말
  SITEMAP: 'sitemap',     // 사이트맵
  CONTACT: 'contact',     // 연락처
  ERROR: 'error'          // 에러 페이지
};

/**
 * 페이지 타입별로 측정할 Puppeteer 항목 매핑
 * 
 * 각 페이지에서 의미있는 항목만 측정
 */
export const PAGE_TYPE_ITEMS = {
  [PAGE_TYPES.MAIN]: [
    'N1_3_action_feedback',   // 버튼 호버/클릭 반응
    'N3_2_emergency_exit',    // 모달 닫기
    'N3_3_flexible_navigation', // 링크 클릭
    'N7_1_accelerators',      // 단축키
    'N7_3_batch_operations'   // 전체 선택
  ],
  [PAGE_TYPES.SEARCH]: [
    'N11_1_search_autocomplete', // 검색 자동완성
    'N11_2_search_quality',      // 검색 결과 품질
    'N3_3_flexible_navigation'   // 결과 링크 클릭
  ],
  [PAGE_TYPES.LOGIN]: [
    'N5_1_input_validation',  // 입력 검증
    'N9_1_error_messages',    // 오류 메시지
    'N9_2_recovery_support',  // 복구 기능
    'N1_3_action_feedback'    // 버튼 반응
  ],
  [PAGE_TYPES.BOARD_LIST]: [
    'N3_3_flexible_navigation', // 게시글 링크
    'N6_1_visible_options',     // 옵션 가시성
    'N7_3_batch_operations'     // 전체 선택
  ],
  [PAGE_TYPES.BOARD_DETAIL]: [
    'N3_2_emergency_exit',    // 뒤로가기
    'N8_1_essential_info',    // 핵심 정보
    'N1_3_action_feedback'    // 버튼 반응
  ],
  [PAGE_TYPES.PROMO]: [
    'N1_3_action_feedback',   // CTA 버튼
    'N3_3_flexible_navigation', // 링크
    'N8_1_essential_info'     // 정보 표시
  ],
  [PAGE_TYPES.FAQ]: [
    'N10_1_help_visibility',  // 도움말 가시성
    'N11_1_search_autocomplete', // FAQ 검색
    'N3_2_emergency_exit'     // 아코디언 닫기
  ],
  [PAGE_TYPES.SITEMAP]: [
    'N3_3_flexible_navigation', // 모든 링크
    'N6_1_visible_options',     // 전체 옵션 표시
    'N8_1_essential_info'       // 구조 정보
  ],
  [PAGE_TYPES.CONTACT]: [
    'N5_1_input_validation',  // 폼 검증
    'N9_1_error_messages',    // 오류 메시지
    'N1_3_action_feedback'    // 제출 버튼
  ],
  [PAGE_TYPES.ERROR]: [
    'N9_1_error_messages',    // 오류 설명
    'N9_2_recovery_support',  // 복구 링크
    'N3_3_flexible_navigation' // 홈으로 가기
  ]
};

/**
 * URL 패턴으로 페이지 타입 추론
 */
export function inferPageType(url, index) {
  const urlLower = url.toLowerCase();
  
  // 인덱스 기반 추론 (index.html에서 순서대로 입력된 경우)
  const indexTypeMap = {
    0: PAGE_TYPES.MAIN,
    1: PAGE_TYPES.SEARCH,
    2: PAGE_TYPES.LOGIN,
    3: PAGE_TYPES.BOARD_LIST,
    4: PAGE_TYPES.BOARD_DETAIL,
    5: PAGE_TYPES.PROMO,
    6: PAGE_TYPES.FAQ,
    7: PAGE_TYPES.SITEMAP,
    8: PAGE_TYPES.CONTACT,
    9: PAGE_TYPES.ERROR
  };
  
  // URL 패턴 기반 추론
  if (urlLower.includes('/search') || urlLower.includes('?q=') || urlLower.includes('?search=')) {
    return PAGE_TYPES.SEARCH;
  }
  if (urlLower.includes('/login') || urlLower.includes('/signin') || urlLower.includes('/member')) {
    return PAGE_TYPES.LOGIN;
  }
  if (urlLower.includes('/board') || urlLower.includes('/notice') || urlLower.includes('/bbs')) {
    if (urlLower.includes('/view') || urlLower.includes('/read') || /\/\d+$/.test(urlLower)) {
      return PAGE_TYPES.BOARD_DETAIL;
    }
    return PAGE_TYPES.BOARD_LIST;
  }
  if (urlLower.includes('/faq') || urlLower.includes('/help') || urlLower.includes('/qna')) {
    return PAGE_TYPES.FAQ;
  }
  if (urlLower.includes('/sitemap') || urlLower.includes('/map')) {
    return PAGE_TYPES.SITEMAP;
  }
  if (urlLower.includes('/contact') || urlLower.includes('/inquiry')) {
    return PAGE_TYPES.CONTACT;
  }
  if (urlLower.includes('/404') || urlLower.includes('/error')) {
    return PAGE_TYPES.ERROR;
  }
  if (urlLower.includes('/promo') || urlLower.includes('/event') || urlLower.includes('/campaign')) {
    return PAGE_TYPES.PROMO;
  }
  
  // 인덱스 기반 기본값
  return indexTypeMap[index] || PAGE_TYPES.MAIN;
}

/**
 * 페이지 타입에 따라 분석할 항목 목록 반환
 */
export function getItemsForPageType(pageType) {
  return PAGE_TYPE_ITEMS[pageType] || PAGE_TYPE_ITEMS[PAGE_TYPES.MAIN];
}

/**
 * 모든 페이지의 결과를 통합
 * 같은 항목이 여러 페이지에서 측정된 경우 평균 사용
 * 
 * ⚠️ 중요: 모든 페이지는 같은 사이트여야 함!
 */
export function mergePageResults(pageResults) {
  // 도메인 검증
  const domains = pageResults.map(r => {
    try {
      return new URL(r.pageUrl).hostname;
    } catch {
      return null;
    }
  }).filter(Boolean);
  
  const uniqueDomains = [...new Set(domains)];
  if (uniqueDomains.length > 1) {
    console.warn(`⚠️  경고: 여러 도메인이 감지되었습니다: ${uniqueDomains.join(', ')}`);
    console.warn(`   한 사이트의 여러 페이지만 입력해야 정확한 평가가 가능합니다.`);
  }
  
  const itemScores = {};
  const itemCounts = {};
  
  // 각 페이지의 결과를 수집
  pageResults.forEach(({ pageType, pageUrl, results }) => {
    Object.entries(results).forEach(([itemId, data]) => {
      if (!itemScores[itemId]) {
        itemScores[itemId] = 0;
        itemCounts[itemId] = 0;
      }
      itemScores[itemId] += data.score;
      itemCounts[itemId]++;
    });
  });
  
  // 평균 계산
  const mergedScores = {};
  Object.keys(itemScores).forEach(itemId => {
    mergedScores[itemId] = itemScores[itemId] / itemCounts[itemId];
  });
  
  return mergedScores;
}

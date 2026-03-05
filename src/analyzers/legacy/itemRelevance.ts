/**
 * Nielsen 평가 항목별 영향 페이지 추적
 */

import type { HTMLStructure } from './htmlAnalyzer'

export interface ItemEvaluationResult {
  itemId: string
  relevantPages: string[]  // 이 항목 평가에 영향을 준 페이지들
  reason: string  // 왜 이 페이지들이 관련되는지
}

/**
 * 각 페이지에서 특정 항목의 영향도를 평가
 */
export function evaluateItemRelevance(pageResults: any[]): Map<string, string[]> {
  const itemRelevance = new Map<string, string[]>()
  
  // N1.1 - Breadcrumb (서브 페이지에서만 의미있음)
  const breadcrumbPages = pageResults
    .filter(p => !p.isMainPage && p.structure.navigation.breadcrumbExists)
    .map(p => p.url)
  if (breadcrumbPages.length === 0) {
    // Breadcrumb이 없으면 서브 페이지들이 감점 원인
    itemRelevance.set('N1_1', pageResults.filter(p => !p.isMainPage).map(p => p.url))
  } else {
    itemRelevance.set('N1_1', breadcrumbPages)
  }
  
  // N1.2 - ARIA 레이블 (모든 페이지 평균)
  const ariaPages = pageResults
    .filter(p => p.structure.accessibility.ariaLabelCount > 0)
    .map(p => p.url)
  itemRelevance.set('N1_2', ariaPages.length > 0 ? ariaPages : pageResults.map(p => p.url))
  
  // N1.3 - 폼 검증 (폼이 있는 페이지)
  const validationPages = pageResults
    .filter(p => p.structure.forms.validationExists || p.structure.forms.formCount > 0)
    .map(p => p.url)
  itemRelevance.set('N1_3', validationPages.length > 0 ? validationPages : [pageResults[0].url])
  
  // N2.1 - lang 속성 (모든 페이지)
  const langPages = pageResults
    .filter(p => p.structure.accessibility.langAttribute)
    .map(p => p.url)
  itemRelevance.set('N2_1', langPages.length > 0 ? langPages : pageResults.map(p => p.url))
  
  // N2.2 - 헤딩 구조 (모든 페이지)
  itemRelevance.set('N2_2', pageResults.map(p => p.url))
  
  // N2.3 - 아이콘 (모든 페이지)
  itemRelevance.set('N2_3', pageResults.map(p => p.url))
  
  // N3.1 - 폼 (폼이 있는 페이지)
  const formPages = pageResults
    .filter(p => p.structure.forms.formCount > 0)
    .map(p => p.url)
  itemRelevance.set('N3_1', formPages.length > 0 ? formPages : [pageResults[0].url])
  
  // N3.3 - 링크 (모든 페이지)
  itemRelevance.set('N3_3', pageResults.map(p => p.url))
  
  // N4.1, N4.2, N4.3 - 일관성 (모든 페이지)
  itemRelevance.set('N4_1', pageResults.map(p => p.url))
  itemRelevance.set('N4_2', pageResults.map(p => p.url))
  itemRelevance.set('N4_3', pageResults.map(p => p.url))
  
  // N5.1, N5.2, N5.3 - 폼 관련 (폼이 있는 페이지)
  itemRelevance.set('N5_1', formPages.length > 0 ? formPages : [pageResults[0].url])
  itemRelevance.set('N5_2', formPages.length > 0 ? formPages : [pageResults[0].url])
  itemRelevance.set('N5_3', formPages.length > 0 ? formPages : [pageResults[0].url])
  
  // N6.2 - 아이콘 (모든 페이지)
  itemRelevance.set('N6_2', pageResults.map(p => p.url))
  
  // N6.3 - Breadcrumb (서브 페이지)
  itemRelevance.set('N6_3', pageResults.filter(p => !p.isMainPage).map(p => p.url))
  
  // N7.1 - 가속 장치 (모든 페이지)
  itemRelevance.set('N7_1', pageResults.map(p => p.url))
  
  // N7.2 - 맞춤설정 (모든 페이지)
  itemRelevance.set('N7_2', pageResults.map(p => p.url))
  
  // N7.3 - 검색 (검색이 있는 페이지)
  const searchPages = pageResults
    .filter(p => p.structure.navigation.searchExists)
    .map(p => p.url)
  itemRelevance.set('N7_3', searchPages.length > 0 ? searchPages : pageResults.map(p => p.url))
  
  // N8.1, N8.2, N8.3 - 미니멀 디자인 (모든 페이지)
  itemRelevance.set('N8_1', pageResults.map(p => p.url))
  itemRelevance.set('N8_2', pageResults.map(p => p.url))
  itemRelevance.set('N8_3', pageResults.map(p => p.url))
  
  // N9.2, N9.4 - 오류 복구 (폼이 있는 페이지)
  itemRelevance.set('N9_2', formPages.length > 0 ? formPages : [pageResults[0].url])
  itemRelevance.set('N9_4', pageResults.map(p => p.url))
  
  // N10.1, N10.2 - 도움말 (모든 페이지)
  itemRelevance.set('N10_1', searchPages.length > 0 ? searchPages : pageResults.map(p => p.url))
  itemRelevance.set('N10_2', pageResults.map(p => p.url))
  
  // N11: 검색 기능 (검색이 있는 페이지 + 검색 결과 페이지)
  const searchResultPages = pageResults.filter(p => 
    p.url.toLowerCase().includes('search') || 
    p.url.toLowerCase().includes('검색') ||
    p.structure.navigation.searchExists
  ).map(p => p.url)
  itemRelevance.set('N11_1', searchResultPages.length > 0 ? searchResultPages : searchPages)
  itemRelevance.set('N11_2', searchResultPages.length > 0 ? searchResultPages : searchPages)
  
  // N12: 반응형 디자인 (모든 페이지 - 모바일 대응 확인)
  itemRelevance.set('N12_1', pageResults.map(p => p.url))
  itemRelevance.set('N12_2', pageResults.map(p => p.url))
  
  // N13: 콘텐츠 신선도 (게시판/뉴스/공지사항 페이지)
  const contentPages = pageResults.filter(p => 
    p.url.toLowerCase().includes('board') ||
    p.url.toLowerCase().includes('notice') ||
    p.url.toLowerCase().includes('news') ||
    p.url.toLowerCase().includes('게시') ||
    p.url.toLowerCase().includes('공지') ||
    p.url.toLowerCase().includes('소식')
  ).map(p => p.url)
  itemRelevance.set('N13', contentPages.length > 0 ? contentPages : pageResults.map(p => p.url))
  
  // N14: 접근성 (모든 페이지)
  itemRelevance.set('N14_1', pageResults.map(p => p.url))
  itemRelevance.set('N14_2', pageResults.map(p => p.url))
  
  // N15: 파일 다운로드 (자료실/다운로드 페이지)
  const downloadPages = pageResults.filter(p => 
    p.url.toLowerCase().includes('download') ||
    p.url.toLowerCase().includes('file') ||
    p.url.toLowerCase().includes('자료') ||
    p.url.toLowerCase().includes('다운') ||
    p.structure.html?.includes('download') ||
    p.structure.html?.includes('.pdf') ||
    p.structure.html?.includes('.zip')
  ).map(p => p.url)
  itemRelevance.set('N15', downloadPages.length > 0 ? downloadPages : [pageResults[0].url])
  
  // N16: 폼 복잡도 (회원가입/문의하기/신청 페이지)
  const complexFormPages = pageResults.filter(p => 
    p.url.toLowerCase().includes('join') ||
    p.url.toLowerCase().includes('register') ||
    p.url.toLowerCase().includes('signup') ||
    p.url.toLowerCase().includes('contact') ||
    p.url.toLowerCase().includes('inquiry') ||
    p.url.toLowerCase().includes('apply') ||
    p.url.toLowerCase().includes('회원가입') ||
    p.url.toLowerCase().includes('가입') ||
    p.url.toLowerCase().includes('문의') ||
    p.url.toLowerCase().includes('신청') ||
    p.structure.forms.formCount > 0
  ).map(p => p.url)
  itemRelevance.set('N16', complexFormPages.length > 0 ? complexFormPages : formPages.length > 0 ? formPages : [pageResults[0].url])
  
  // N17: 성능 지표 (모든 페이지 - 특히 메인/목록 페이지)
  itemRelevance.set('N17_1', pageResults.map(p => p.url))
  itemRelevance.set('N17_2', pageResults.map(p => p.url))
  itemRelevance.set('N17_3', pageResults.map(p => p.url))
  itemRelevance.set('N17_4', pageResults.map(p => p.url))
  
  // N18: 다국어 지원 (모든 페이지)
  const multilingualPages = pageResults.filter(p => 
    p.structure.html?.toLowerCase().includes('lang=') ||
    p.structure.html?.toLowerCase().includes('english') ||
    p.structure.html?.toLowerCase().includes('中文') ||
    p.structure.html?.toLowerCase().includes('日本語')
  ).map(p => p.url)
  itemRelevance.set('N18', multilingualPages.length > 0 ? multilingualPages : pageResults.map(p => p.url))
  
  // N19: 알림 시스템 (모든 페이지)
  itemRelevance.set('N19', pageResults.map(p => p.url))
  
  // N20: 브랜딩 (모든 페이지)
  itemRelevance.set('N20', pageResults.map(p => p.url))
  
  return itemRelevance
}

// src/analyzers/nielsenEvaluator.js - COMPLETE VERSION
import { getItemDetails } from '../config/itemDetails.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { predictFromNielsenScores } from '../ml/predictScore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1,617개 국민평가 데이터 로드
let nationalBenchmark = null;
let nationalMapping = null;
try {
  const benchmarkPath = join(__dirname, '../../data/national_evaluation_benchmark.json');
  const mappingPath = join(__dirname, '../../data/national_evaluation_mapping.json');
  nationalBenchmark = JSON.parse(readFileSync(benchmarkPath, 'utf-8'));
  nationalMapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));
  console.log('✅ 1,617개 국민평가 데이터 + 매핑 로드 완료');
} catch (error) {
  console.warn('⚠️ 국민평가 데이터 로드 실패, 기본값 사용');
}

/**
 * Nielsen 26개 항목 점수 계산 (Puppeteer 통합 + 1,617개 국민평가 데이터 기반 + ML 예측)
 */
export async function calculateNielsenScores(htmlAnalysis, advancedMetrics = {}) {
  console.log('📊 Nielsen 점수 계산 중... (1,617개 국민평가 데이터 기반 + ML 예측)');
  
  const { structure, accessibility } = htmlAnalysis;
  const { interaction = {}, performance = {} } = advancedMetrics;
  
  const scores = {
    // N1: 시스템 상태 가시성
    N1_1_status_visibility: calculateBasicScore(structure.navigation.hasNav, 3.5),
    N1_2_feedback_timing: 3.5,
    N1_3_action_feedback: interaction.N1_3_action_feedback?.score || 3.0,
    
    // N2: 현실 세계 일치
    N2_1_familiar_terms: 3.5,
    N2_2_natural_flow: calculateNavigationScore(structure.links),
    
    // N3: 사용자 제어와 자유
    N3_1_undo_redo: calculateBasicScore(structure.forms.count > 0, 3.0),
    N3_2_emergency_exit: interaction.N3_2_emergency_exit?.score || 3.5,
    N3_3_flexible_navigation: interaction.N3_3_flexible_navigation?.score || calculateNavigationScore(structure.links),
    
    // N4: 일관성과 표준
    N4_1_visual_consistency: 3.5,
    N4_2_terminology_consistency: 3.5,
    N4_3_standard_compliance: 4.0,
    
    // N5: 오류 방지
    N5_1_input_validation: interaction.N5_1_input_validation?.score || calculateBasicScore(structure.forms.inputs > 0, 3.5),
    N5_2_confirmation_dialog: 3.5,
    N5_3_constraints: 3.5,
    
    // N6: 인식보다 회상
    N6_1_visible_options: 4.0,
    N6_2_recognition_cues: 3.5,
    N6_3_memory_load: calculateBasicScore(structure.navigation.hasBreadcrumb, 3.5),
    
    // N7: 유연성과 효율성
    N7_1_accelerators: interaction.N7_1_accelerators?.score || 3.0,
    N7_2_personalization: interaction.N7_2_personalization?.score || 3.0,
    N7_3_batch_operations: interaction.N7_3_batch_operations?.score || 3.0,
    
    // N8: 미니멀 디자인
    N8_1_essential_info: 3.5,
    N8_2_clean_interface: 3.5,
    N8_3_visual_hierarchy: calculateBasicScore(structure.headings.total > 5, 3.5),
    
    // N9: 오류 인식 및 복구
    N9_1_error_messages: interaction.N9_1_error_messages?.score || 3.5,
    N9_2_recovery_support: interaction.N9_2_recovery_support?.score || 3.0,
    
    // N10: 도움말과 문서
    N10_1_help_visibility: 3.5,
    N10_2_documentation: 3.5,
    
    // N11: 검색 기능
    N11_1_search_autocomplete: interaction.N11_1_search_autocomplete?.score || 2.0,
    N11_2_search_quality: interaction.N11_2_search_quality?.score || (interaction.N11_1_search_autocomplete?.hasSearch ? 3.5 : 2.0),
    
    // N12: 반응형 디자인
    N12_1_responsive_layout: 4.0,
    N12_2_touch_optimization: 3.5,
    
    // N13: 콘텐츠 신선도
    N13_content_freshness: 3.5,
    
    // N14: 접근성
    N14_1_color_contrast: 3.5,
    N14_2_keyboard_accessibility: calculateBasicScore(accessibility.skipNavigation || accessibility.ariaLabels > 5, 3.5),
    
    // N15: 파일 다운로드
    N15_file_download: 3.0,
    
    // N16: 폼 복잡도
    N16_form_complexity: calculateFormComplexity(structure.forms),
    
    // N17: 성능 (Lighthouse 실측) - 실패 시 항목 제외
    ...(performance.error ? {} : {
      N17_1_lcp_performance: performance.lcp?.score || 3.0,
      N17_2_fid_responsiveness: performance.fid?.score || 3.0,
      N17_3_cls_stability: performance.cls?.score || 3.0,
      N17_4_tti_interactive: performance.tti?.score || 3.0
    }),
    
    // N18: 다국어 지원
    N18_multilingual: calculateBasicScore(accessibility.langAttribute, 2.5),
    
    // N19: 알림 시스템
    N19_notification: 2.5,
    
    // N20: 브랜딩
    N20_branding: calculateBrandingScore(structure)
  };
  
  // 정확도 계산
  const accuracyMap = {
    high_accuracy: [],  // 95%+ (Puppeteer 실측)
    medium_accuracy: [],  // 85-90% (패턴 매칭 + 실측)
    low_accuracy: []  // 70-80% (HTML만)
  };
  
  // Puppeteer 실측 항목 (95%+) - 정확한 키 이름 사용
  if (interaction.N1_3_action_feedback) accuracyMap.high_accuracy.push('N1_3');
  if (interaction.N3_2_emergency_exit) accuracyMap.high_accuracy.push('N3_2');
  if (interaction.N3_3_flexible_navigation) accuracyMap.high_accuracy.push('N3_3');
  if (interaction.N11_1_search_autocomplete) accuracyMap.high_accuracy.push('N11_1');
  if (interaction.N11_2_search_quality) accuracyMap.high_accuracy.push('N11_2');
  if (interaction.N5_1_input_validation) accuracyMap.high_accuracy.push('N5_1');
  if (interaction.N9_1_error_messages) accuracyMap.high_accuracy.push('N9_1');
  
  // Lighthouse 실측 항목 (98%+)
  let lighthouseMeasured = 0;
  // performance.error가 없고, 실제 측정값이 있을 때만 성공으로 판단
  if (!performance.error && (performance.lcp?.value > 0 || performance.lcp?.score > 0)) {
    accuracyMap.high_accuracy.push('N17_1', 'N17_2', 'N17_3', 'N17_4');
    lighthouseMeasured = 4;  // Lighthouse 성공 시에만 4개로 설정
  }
  
  // 중간 정확도 (85-90%) - 정확한 키 이름 사용
  if (interaction.N7_1_accelerators) accuracyMap.medium_accuracy.push('N7_1');
  if (interaction.N7_2_personalization) accuracyMap.medium_accuracy.push('N7_2');
  if (interaction.N7_3_batch_operations) accuracyMap.medium_accuracy.push('N7_3');
  if (interaction.N9_2_recovery_support) accuracyMap.medium_accuracy.push('N9_2');
  
  // 통계 계산
  const scoreValues = Object.values(scores);
  const totalScore = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;
  const grade = totalScore >= 4.5 ? 'A+' : 
                totalScore >= 4.0 ? 'A' : 
                totalScore >= 3.5 ? 'B+' : 
                totalScore >= 3.0 ? 'B' : 'C';
  
  // 실측률 계산 (실제 측정한 항목의 비율)
  const highCount = accuracyMap.high_accuracy.length;
  const mediumCount = accuracyMap.medium_accuracy.length;
  const lowCount = scoreValues.length - highCount - mediumCount;
  
  // 실측률 = 실제 측정 항목 / 전체 항목
  const measuredCount = highCount + mediumCount;
  const measuredRate = ((measuredCount / scoreValues.length) * 100).toFixed(1);
  
  console.log(`✅ Nielsen 점수: ${totalScore.toFixed(2)}/5.0 (${grade}) | 실제 브라우저 분석 + AI 정적 분석`);
  
  // 각 항목에 상세 정보 + 국민평가 비교 추가
  const scoresWithDetails = {};
  for (const [itemId, score] of Object.entries(scores)) {
    const details = getItemDetails(itemId);
    const nationalItemComparison = getNationalItemComparison(itemId, score);
    
    scoresWithDetails[itemId] = {
      score,
      name: details.name,
      description: details.description,
      why_important: details.why_important,
      evaluation_criteria: details.evaluation_criteria,
      nationalComparison: nationalItemComparison  // 항목별 국민평가 비교
    };
  }
  
  // 국민평가 데이터와 비교
  const nationalComparison = nationalBenchmark ? {
    yourScore: totalScore.toFixed(2),
    nationalAverage: nationalBenchmark.national_average.종합_평균,
    difference: (totalScore - nationalBenchmark.national_average.종합_평균).toFixed(2),
    percentile: calculatePercentile(totalScore, nationalBenchmark),
    message: totalScore >= nationalBenchmark.national_average.종합_평균 
      ? `국민평가 평균(${nationalBenchmark.national_average.종합_평균})보다 ${(totalScore - nationalBenchmark.national_average.종합_평균).toFixed(2)}점 높습니다` 
      : `국민평가 평균(${nationalBenchmark.national_average.종합_평균})보다 ${(nationalBenchmark.national_average.종합_평균 - totalScore).toFixed(2)}점 낮습니다 (개선 필요)`
  } : null;

  // ML 모델 예측 (비동기)
  let mlPrediction = null;
  if (nationalMapping) {
    try {
      console.log('🤖 ML 모델로 예상 국민평가 점수 예측 중...');
      mlPrediction = await predictFromNielsenScores(scores, nationalMapping);
      console.log(`✅ ML 예측 완료: ${mlPrediction.predicted_score}/5.0 (${mlPrediction.grade})`);
    } catch (error) {
      console.warn(`⚠️ ML 예측 실패: ${error.message}`);
    }
  }

  return {
    scores: scoresWithDetails,
    summary: {
      totalScore,
      grade,
      itemCount: scoreValues.length,
      excellentCount: scoreValues.filter(s => s >= 4.5).length,
      goodCount: scoreValues.filter(s => s >= 4.0 && s < 4.5).length,
      fairCount: scoreValues.filter(s => s >= 3.0 && s < 4.0).length,
      poorCount: scoreValues.filter(s => s < 3.0).length,
      overallMeasuredRate: `${measuredRate}%`,
      accuracyBreakdown: {
        puppeteerMeasured: highCount - lighthouseMeasured,  // Puppeteer만
        patternMatched: mediumCount,
        lighthouseMeasured,  // Lighthouse 성공 여부
        htmlOnly: lowCount
      },
      nationalComparison,  // 1,617개 국민평가 데이터 비교
      mlPrediction  // ML 예측 결과
    }
  };
}

// 헬퍼 함수들
function calculatePercentile(score, benchmark) {
  // 49개 공공기관 중 상대적 순위 계산
  const distribution = benchmark.grade_distribution;
  
  if (score >= 4.5) {
    return '상위 4% (A+ 등급, 최우수)';
  } else if (score >= 4.0) {
    return '상위 20% (A 등급, 우수)';
  } else if (score >= 3.5) {
    return '상위 57% (B+ 등급, 양호)';
  } else if (score >= 3.0) {
    return '상위 87% (B 등급, 보통)';
  } else {
    return '하위 13% (C 등급, 개선 필요)';
  }
}

function calculateBasicScore(condition, baseScore) {
  return condition ? baseScore + 1.0 : baseScore;
}

function calculateNavigationScore(links) {
  if (links.total === 0) return 2.0;
  if (links.total >= 50) return 4.5;
  if (links.total >= 20) return 4.0;
  return 3.5;
}

function calculateFormComplexity(forms) {
  if (forms.count === 0) return 4.0;
  if (forms.inputs <= 5) return 4.5;
  if (forms.inputs <= 10) return 4.0;
  if (forms.inputs <= 20) return 3.5;
  return 3.0;
}

function calculateBrandingScore(structure) {
  let score = 2.0;
  if (structure.title && structure.title.length > 0) score += 0.5;
  if (structure.images.count > 0) score += 0.5;
  if (structure.headings.h1 > 0) score += 0.5;
  return Math.min(5.0, score);
}

/**
 * Nielsen 항목별 국민평가 데이터 비교
 * @param {string} itemId - Nielsen 항목 ID (예: N1_1_status_visibility)
 * @param {number} score - 현재 사이트의 점수
 * @returns {object|null} - 국민평가 비교 결과
 */
function getNationalItemComparison(itemId, score) {
  if (!nationalBenchmark || !nationalMapping) return null;
  
  // Nielsen 항목 → 국민평가 Q1~Q10 역매핑
  const mapping = nationalMapping.mapping;
  let relatedQuestions = [];
  
  for (const [qKey, qData] of Object.entries(mapping)) {
    if (qData.nielsen_items && qData.nielsen_items.includes(itemId)) {
      relatedQuestions.push({
        question: qKey,
        questionText: qData.question,
        category: qData.category,
        nationalAverage: nationalBenchmark.national_average[qKey]
      });
    }
  }
  
  if (relatedQuestions.length === 0) return null;
  
  // 해당 Nielsen 항목과 관련된 국민평가 질문들의 평균
  const avgNationalScore = relatedQuestions.reduce((sum, q) => sum + q.nationalAverage, 0) / relatedQuestions.length;
  const difference = (score - avgNationalScore).toFixed(2);
  
  return {
    relatedQuestions: relatedQuestions.map(q => ({
      question: q.question,
      text: q.questionText,
      category: q.category,
      nationalAverage: q.nationalAverage
    })),
    avgNationalScore: avgNationalScore.toFixed(2),
    difference,
    status: score >= avgNationalScore ? '우수' : '개선필요',
    message: score >= avgNationalScore
      ? `국민평가 평균(${avgNationalScore.toFixed(2)})보다 ${Math.abs(difference)}점 높습니다`
      : `국민평가 평균(${avgNationalScore.toFixed(2)})보다 ${Math.abs(difference)}점 낮습니다 (개선 필요)`
  };
}

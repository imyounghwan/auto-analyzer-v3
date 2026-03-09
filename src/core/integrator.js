// src/core/integrator.js - MULTI-PAGE VERSION
import cliProgress from 'cli-progress';
import { launchBrowser, openPage } from './browser.js';
import { analyzeHTML } from '../analyzers/htmlAnalyzer.js';
import { runAllInteractionAnalysis } from '../analyzers/interactionAnalyzer.js';
import { analyzeWebVitals } from '../analyzers/performanceAnalyzer.js';
import { calculateNielsenScores } from '../analyzers/nielsenEvaluator.js';
import { 
  inferPageType, 
  getItemsForPageType, 
  mergePageResults 
} from './pageTypeMapping.js';

/**
 * 종합 분석 실행
 * @param {string} url - 메인 URL
 * @param {string[]} targetPages - 평가 대상 페이지 목록 (선택)
 */
export async function runComprehensiveAnalysis(url, targetPages = null) {
  const progressBar = new cliProgress.SingleBar({
    format: '진행: [{bar}] {percentage}% | {task}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });
  
  progressBar.start(100, 0, { task: '초기화 중...' });
  
  // 분석할 페이지 목록 결정
  const pagesToAnalyze = targetPages && targetPages.length > 0 ? targetPages : [url];
  const pageCount = pagesToAnalyze.length;
  
  console.log(`\n📄 총 ${pageCount}개 페이지 분석 시작`);
  pagesToAnalyze.forEach((page, i) => {
    const pageType = inferPageType(page, i);
    console.log(`   ${i+1}. ${page} [${pageType}]`);
  });
  console.log('');
  
  let browser;
  let allPageResults = [];
  
  try {
    // 1. HTML 분석 (메인 페이지만)
    progressBar.update(10, { task: `📄 HTML 분석 중...` });
    const htmlAnalysis = await analyzeHTML(url);
    
    // 2. 브라우저 실행
    progressBar.update(20, { task: '🚀 브라우저 실행...' });
    browser = await launchBrowser();
    
    // 3. 각 페이지별로 분석
    for (let i = 0; i < pageCount; i++) {
      const pageUrl = pagesToAnalyze[i];
      const pageType = inferPageType(pageUrl, i);
      const progress = 20 + ((i / pageCount) * 50); // 20%~70%
      
      progressBar.update(progress, { task: `🖱️  페이지 ${i+1}/${pageCount} 분석 중... [${pageType}]` });
      
      try {
        const page = await openPage(browser, pageUrl);
        
        // 이 페이지 타입에 해당하는 항목만 분석
        const itemsToAnalyze = getItemsForPageType(pageType);
        console.log(`\n   📊 ${pageUrl}`);
        console.log(`   타입: ${pageType}, 측정 항목: ${itemsToAnalyze.length}개`);
        
        // 해당 항목만 분석
        const interactionResults = await runSelectiveInteractionAnalysis(page, itemsToAnalyze);
        
        allPageResults.push({
          pageUrl,
          pageType,
          itemsAnalyzed: itemsToAnalyze,
          results: interactionResults
        });
        
        await page.close();
      } catch (pageError) {
        console.warn(`   ⚠️  페이지 ${i+1} 분석 실패: ${pageError.message}`);
      }
    }
    
    // 4. Lighthouse 성능 측정 (메인 페이지만)
    let performanceResults = {};
    try {
      progressBar.update(75, { task: '⚡ 성능 측정 중 (Lighthouse)...' });
      performanceResults = await Promise.race([
        analyzeWebVitals(url),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Lighthouse timeout (90s)')), 90000)
        )
      ]);
      console.log('\n✅ Lighthouse 분석 완료');
    } catch (perfError) {
      console.warn(`\n⚠️  Lighthouse 스킵: ${perfError.message}`);
    }
    
    await browser.close();
    
    // 5. 결과 통합
    progressBar.update(85, { task: '📊 결과 통합 중...' });
    const mergedInteractionResults = mergePageResults(allPageResults);
    
    // 6. Nielsen 점수 계산
    progressBar.update(95, { task: '📊 Nielsen 점수 계산...' });
    const nielsenResult = calculateNielsenScores(htmlAnalysis, {
      interaction: mergedInteractionResults,
      performance: performanceResults
    });
    
    progressBar.update(100, { task: '✅ 완료!' });
    progressBar.stop();
    
    // analyzed_pages 메타데이터
    const analyzedPages = {
      main_page: url,
      sub_pages: pagesToAnalyze.slice(1),
      total_count: pageCount,
      page_details: allPageResults.map(p => ({
        url: p.pageUrl,
        type: p.pageType,
        items_count: p.itemsAnalyzed.length,
        items: p.itemsAnalyzed
      })),
      note: `${pageCount}개 페이지 분석 완료 (페이지별 항목 선택적 측정)`
    };
    
    return {
      url,
      analyzedAt: new Date().toISOString(),
      version: '3.0.0',
      analyzed_pages: analyzedPages,
      ...nielsenResult,
      details: {
        html: {
          structure: htmlAnalysis.structure,
          accessibility: htmlAnalysis.accessibility
        },
        interaction: mergedInteractionResults,
        performance: performanceResults,
        page_results: allPageResults
      },
      metadata: {
        puppeteerEnabled: true,
        lighthouseEnabled: performanceResults.lcp ? true : false,
        analysisTime: new Date().toISOString(),
        pagesAnalyzed: pageCount
      }
    };
    
  } catch (error) {
    progressBar.stop();
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
    throw error;
  }
}

/**
 * 선택적 인터랙션 분석 (특정 항목만)
 */
async function runSelectiveInteractionAnalysis(page, itemIds) {
  const results = {};
  
  // 전체 분석 함수 import
  const { 
    analyzeActionFeedback,
    analyzeEmergencyExit,
    analyzeFlexibleNavigation,
    analyzeAccelerators,
    analyzePersonalization,
    analyzeBatchOperations,
    analyzeRecoverySupport,
    analyzeSearchAutocomplete,
    analyzeSearchQuality
  } = await import('../analyzers/interactionAnalyzer.js');
  
  const analysisMap = {
    'N1_3_action_feedback': analyzeActionFeedback,
    'N3_2_emergency_exit': analyzeEmergencyExit,
    'N3_3_flexible_navigation': analyzeFlexibleNavigation,
    'N7_1_accelerators': analyzeAccelerators,
    'N7_2_personalization': analyzePersonalization,
    'N7_3_batch_operations': analyzeBatchOperations,
    'N9_2_recovery_support': analyzeRecoverySupport,
    'N11_1_search_autocomplete': analyzeSearchAutocomplete,
    'N11_2_search_quality': analyzeSearchQuality
  };
  
  for (const itemId of itemIds) {
    const analyzeFunc = analysisMap[itemId];
    if (analyzeFunc) {
      try {
        results[itemId] = await analyzeFunc(page);
        console.log(`      ✓ ${itemId}: ${results[itemId].score.toFixed(1)}`);
      } catch (error) {
        console.warn(`      ✗ ${itemId}: 실패 (${error.message})`);
        results[itemId] = { score: 2.0, details: { error: error.message } };
      }
    }
  }
  
  return results;
}

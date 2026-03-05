// src/core/integrator.js - COMPLETE VERSION
import cliProgress from 'cli-progress';
import { launchBrowser, openPage } from './browser.js';
import { analyzeHTML } from '../analyzers/htmlAnalyzer.js';
import { runAllInteractionAnalysis } from '../analyzers/interactionAnalyzer.js';
import { analyzeWebVitals } from '../analyzers/performanceAnalyzer.js';
import { calculateNielsenScores } from '../analyzers/nielsenEvaluator.js';

/**
 * 종합 분석 실행
 */
export async function runComprehensiveAnalysis(url) {
  const progressBar = new cliProgress.SingleBar({
    format: '진행: [{bar}] {percentage}% | {task}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });
  
  progressBar.start(100, 0, { task: '초기화 중...' });
  
  let browser;
  
  try {
    // 1. HTML 분석 (Axios + Cheerio)
    progressBar.update(20, { task: '📄 HTML 다운로드 및 분석...' });
    const htmlAnalysis = await analyzeHTML(url);
    
    // 2. Puppeteer 인터랙션 분석 (선택적)
    let interactionResults = {};
    let performanceResults = {};
    
    try {
      progressBar.update(40, { task: '🚀 브라우저 실행...' });
      browser = await launchBrowser();
      const page = await openPage(browser, url);
      
      progressBar.update(60, { task: '🖱️  인터랙션 분석 중 (9개 항목)...' });
      interactionResults = await runAllInteractionAnalysis(page);
      
      // 3. Lighthouse 성능 측정 (선택적, Puppeteer 성공 시만 실행)
      try {
        progressBar.update(70, { task: '⚡ 성능 측정 중 (Lighthouse)...' });
        performanceResults = await Promise.race([
          analyzeWebVitals(url),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Lighthouse timeout (30s)')), 30000)
          )
        ]);
        console.log('✅ Lighthouse 분석 완료');
      } catch (perfError) {
        console.warn('\n⚠️  Lighthouse 성능 측정 스킵');
        console.warn(`   ${perfError.message}\n`);
      }
      
      await browser.close();
      console.log('✅ Puppeteer 분석 완료');
    } catch (puppeteerError) {
      console.warn('\n⚠️  Puppeteer 분석 스킵 (Chrome 미설치)');
      console.warn('   HTML 분석만으로 계속 진행합니다.\n');
      if (browser) {
        try {
          await browser.close();
        } catch (e) {}
      }
    }
    
    // 4. Nielsen 점수 계산
    progressBar.update(90, { task: '📊 Nielsen 점수 계산...' });
    
    const nielsenResult = calculateNielsenScores(htmlAnalysis, {
      interaction: interactionResults,
      performance: performanceResults
    });
    
    progressBar.update(100, { task: '✅ 완료!' });
    progressBar.stop();
    
    return {
      url,
      analyzedAt: new Date().toISOString(),
      version: '3.0.0',
      ...nielsenResult,
      details: {
        html: {
          structure: htmlAnalysis.structure,
          accessibility: htmlAnalysis.accessibility
        },
        interaction: interactionResults,
        performance: performanceResults
      },
      metadata: {
        puppeteerEnabled: Object.keys(interactionResults).length > 0,
        lighthouseEnabled: performanceResults.lcp ? true : false,
        analysisTime: new Date().toISOString()
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

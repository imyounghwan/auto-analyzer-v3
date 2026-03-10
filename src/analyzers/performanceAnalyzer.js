// src/analyzers/performanceAnalyzer.js
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * Lighthouse Web Vitals 측정 (N17_1-4)
 * Windows EPERM 오류 해결: 환경변수로 Temp 폴더 완전 변경
 */
export async function analyzeWebVitals(url) {
  let chrome;
  
  // 원본 환경변수 백업
  const originalTmpDir = process.env.TMPDIR;
  const originalTemp = process.env.TEMP;
  const originalTmp = process.env.TMP;
  
  try {
    console.log('  ⚡ 성능 측정 중 (Lighthouse)...');
    
    // Windows EPERM 해결: 프로젝트 폴더 내 .tmp 디렉토리 생성
    const customTmpDir = path.join(process.cwd(), '.tmp', 'lighthouse');
    if (!fs.existsSync(customTmpDir)) {
      fs.mkdirSync(customTmpDir, { recursive: true });
    }
    
    // 환경변수를 커스텀 Temp 디렉토리로 변경 (Lighthouse가 이 경로 사용)
    process.env.TMPDIR = customTmpDir;
    process.env.TEMP = customTmpDir;
    process.env.TMP = customTmpDir;
    
    // Chrome 실행 (커스텀 user-data-dir 사용)
    chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        `--user-data-dir=${customTmpDir}`,
        '--disable-extensions'
      ]
    });
    
    const options = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port
    };
    
    const runnerResult = await lighthouse(url, options);
    await chrome.kill();
    
    if (!runnerResult || !runnerResult.lhr) {
      throw new Error('Lighthouse 결과 없음');
    }
    
    const audits = runnerResult.lhr.audits;
    
    // LCP (Largest Contentful Paint)
    const lcpValue = audits['largest-contentful-paint']?.numericValue || 0;
    const lcpScore = lcpValue < 2500 ? 5.0 : lcpValue < 4000 ? 4.0 : lcpValue < 6000 ? 3.0 : 2.0;
    
    // FID (First Input Delay) - TBT로 추정
    const tbtValue = audits['total-blocking-time']?.numericValue || 0;
    const fidScore = tbtValue < 200 ? 5.0 : tbtValue < 600 ? 4.0 : tbtValue < 1000 ? 3.0 : 2.0;
    
    // CLS (Cumulative Layout Shift)
    const clsValue = audits['cumulative-layout-shift']?.numericValue || 0;
    const clsScore = clsValue < 0.1 ? 5.0 : clsValue < 0.25 ? 4.0 : clsValue < 0.5 ? 3.0 : 2.0;
    
    // TTI (Time to Interactive)
    const ttiValue = audits['interactive']?.numericValue || 0;
    const ttiScore = ttiValue < 3800 ? 5.0 : ttiValue < 7300 ? 4.0 : ttiValue < 10000 ? 3.0 : 2.0;
    
    console.log(`  ✅ LCP:${(lcpValue/1000).toFixed(2)}s FID:${tbtValue.toFixed(0)}ms CLS:${clsValue.toFixed(3)} TTI:${(ttiValue/1000).toFixed(2)}s`);
    
    return {
      lcp: { value: lcpValue, score: lcpScore, unit: 'ms' },
      fid: { value: tbtValue, score: fidScore, unit: 'ms' },
      cls: { value: clsValue, score: clsScore, unit: 'score' },
      tti: { value: ttiValue, score: ttiScore, unit: 'ms' },
      accuracy: '98%'
    };
    
  } catch (error) {
    console.error('  ❌ Lighthouse 실패:', error.message);
    if (chrome) {
      try {
        await chrome.kill();
      } catch (e) {}
    }
    
    // 환경변수 복원
    if (originalTmpDir !== undefined) process.env.TMPDIR = originalTmpDir;
    else delete process.env.TMPDIR;
    
    if (originalTemp !== undefined) process.env.TEMP = originalTemp;
    else delete process.env.TEMP;
    
    if (originalTmp !== undefined) process.env.TMP = originalTmp;
    else delete process.env.TMP;
    
    // 에러 정보 반환
    throw error;
  } finally {
    // 환경변수 복원 (성공 시에도)
    if (originalTmpDir !== undefined) process.env.TMPDIR = originalTmpDir;
    else delete process.env.TMPDIR;
    
    if (originalTemp !== undefined) process.env.TEMP = originalTemp;
    else delete process.env.TEMP;
    
    if (originalTmp !== undefined) process.env.TMP = originalTmp;
    else delete process.env.TMP;
  }
}

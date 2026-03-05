// src/core/browser.js
import puppeteer from 'puppeteer';

/**
 * Puppeteer 브라우저 실행
 */
export async function launchBrowser() {
  console.log('🚀 브라우저 실행 중...');
  
  return await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer'
    ]
  });
}

/**
 * 페이지 열기 및 로딩
 */
export async function openPage(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log(`📄 ${url} 로딩 중...`);
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    console.log('✅ 페이지 로딩 완료');
  } catch (error) {
    console.warn(`⚠️ networkidle2 실패, domcontentloaded로 재시도`);
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
  }
  
  return page;
}

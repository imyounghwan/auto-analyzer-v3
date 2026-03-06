// src/core/browser.js
import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

/**
 * Chrome 실행 경로 자동 탐지
 */
function findChrome() {
  const paths = [
    // Windows
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];

  // 1. 환경변수 확인
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  // 2. 일반 경로 확인
  for (const p of paths) {
    if (existsSync(p)) {
      return p;
    }
  }

  // 3. which/where 명령어로 찾기
  try {
    const cmd = process.platform === 'win32' ? 'where chrome' : 'which google-chrome';
    const result = execSync(cmd, { encoding: 'utf-8' }).trim().split('\n')[0];
    if (result && existsSync(result)) {
      return result;
    }
  } catch (e) {
    // ignore
  }

  // 4. Puppeteer 기본값 사용
  return undefined;
}

/**
 * Puppeteer 브라우저 실행
 */
export async function launchBrowser() {
  console.log('🚀 브라우저 실행 중...');
  
  const chromePath = findChrome();
  if (chromePath) {
    console.log(`✅ Chrome 경로: ${chromePath}`);
  } else {
    console.log('⚠️  Chrome 경로를 찾을 수 없습니다. Puppeteer 기본값 사용');
  }
  
  return await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
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

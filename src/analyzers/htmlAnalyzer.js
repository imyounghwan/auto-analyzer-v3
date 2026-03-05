// src/analyzers/htmlAnalyzer.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'node:https';

/**
 * HTML 다운로드 및 기본 분석
 * v2 코드 기반
 */
export async function analyzeHTML(url) {
  try {
    console.log('📄 HTML 분석 중...');
    
    // HTML 다운로드
    const response = await axios.get(url, { 
      timeout: 30000,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      httpsAgent: new https.Agent({ 
        rejectUnauthorized: false,
        keepAlive: true
      })
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // 기본 구조 분석
    const structure = {
      title: $('title').text() || '',
      headings: {
        h1: $('h1').length,
        h2: $('h2').length,
        h3: $('h3').length,
        total: $('h1, h2, h3, h4, h5, h6').length
      },
      links: {
        total: $('a[href]').length,
        internal: $('a[href^="/"], a[href^="#"]').length,
        external: $('a[href^="http"]').length
      },
      forms: {
        count: $('form').length,
        inputs: $('input').length,
        buttons: $('button, input[type="submit"]').length
      },
      images: {
        count: $('img').length,
        withAlt: $('img[alt]').length,
        withoutAlt: $('img:not([alt])').length
      },
      navigation: {
        hasNav: $('nav').length > 0,
        hasBreadcrumb: $('.breadcrumb, [aria-label*="breadcrumb"]').length > 0
      }
    };
    
    // 접근성 기본 체크
    const accessibility = {
      langAttribute: $('html[lang]').length > 0,
      skipNavigation: $('a[href="#main"], a[href="#content"]').length > 0,
      ariaLabels: $('[aria-label]').length,
      ariaDescribedby: $('[aria-describedby]').length
    };
    
    console.log(`✅ HTML 분석 완료 (제목: ${structure.title.substring(0, 30)}...)`);
    
    return { 
      structure, 
      accessibility,
      html: html.substring(0, 50000)  // 첫 50KB만 저장
    };
    
  } catch (error) {
    console.error('❌ HTML 분석 실패:', error.message);
    throw error;
  }
}

/**
 * Cloudflare Browser Rendering API 크롤러
 * 
 * CSR(Client-Side Rendering) 사이트를 위한 브라우저 크롤링
 */

export interface CloudflareBrowserOptions {
  url: string
  timeout?: number
  waitForSelector?: string
}

export interface CloudflareBrowserResult {
  url: string
  html: string
  screenshot?: string
  success: boolean
  error?: string
}

/**
 * Cloudflare Browser Rendering API로 페이지 크롤링
 */
export async function crawlWithCloudflareBrowser(
  browser: any,  // Cloudflare Browser 객체
  options: CloudflareBrowserOptions
): Promise<CloudflareBrowserResult> {
  try {
    const page = await browser.newPage()
    
    try {
      // 페이지 로드 (JavaScript 실행 완료까지 대기)
      await page.goto(options.url, {
        waitUntil: 'networkidle'
      })
      
      // 추가 대기 (동적 콘텐츠 로딩)
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, {
          timeout: options.timeout || 30000
        })
      } else {
        await page.waitForTimeout(3000)
      }
      
      // HTML 추출
      const html = await page.content()
      
      // 스크린샷 (선택)
      let screenshot: string | undefined
      try {
        const screenshotBuffer = await page.screenshot({
          type: 'jpeg',
          quality: 80
        })
        screenshot = Buffer.from(screenshotBuffer).toString('base64')
      } catch (e) {
        console.error('[CloudflareBrowser] Screenshot failed:', e)
      }
      
      await page.close()
      
      return {
        url: options.url,
        html,
        screenshot,
        success: true
      }
    } finally {
      await page.close().catch(() => {})
    }
  } catch (error: any) {
    console.error('[CloudflareBrowser] Error:', error)
    return {
      url: options.url,
      html: '',
      success: false,
      error: error.message
    }
  }
}

/**
 * CSR 사이트 감지
 */
export function isLikelyCSRSite(html: string, url: string): boolean {
  // 1. 도메인 화이트리스트 (알려진 CSR 프레임워크 사용 사이트)
  const csrDomains = [
    'vercel.app',
    'netlify.app',
    'herokuapp.com',
    'github.io'
  ]
  
  if (csrDomains.some(domain => url.includes(domain))) {
    return true
  }
  
  // 2. HTML 구조 분석
  const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is)
  if (!bodyMatch) return false
  
  const bodyContent = bodyMatch[1]
  const textContent = bodyContent.replace(/<script[^>]*>.*?<\/script>/gis, '')
                                   .replace(/<style[^>]*>.*?<\/style>/gis, '')
                                   .replace(/<[^>]+>/g, '')
                                   .trim()
  
  // body가 거의 비어있음 (텍스트 < 100자)
  if (textContent.length < 100) {
    // React/Vue/Angular root 감지
    if (html.includes('id="root"') || 
        html.includes('id="app"') || 
        html.includes('ng-version') ||
        html.includes('data-reactroot')) {
      return true
    }
  }
  
  // 3. 링크/이미지 개수가 매우 적음
  const linkCount = (html.match(/<a\s+[^>]*href=/gi) || []).length
  const imageCount = (html.match(/<img\s+[^>]*src=/gi) || []).length
  
  if (linkCount < 5 && imageCount < 3 && textContent.length < 200) {
    return true
  }
  
  return false
}

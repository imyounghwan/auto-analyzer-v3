// src/core/cache.js
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const CACHE_DIR = './cache';
const CACHE_MAX_AGE = 3600000; // 1시간

/**
 * 캐시 디렉토리 생성
 */
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * URL을 파일명으로 변환
 */
function urlToFilename(url) {
  const hash = crypto.createHash('md5').update(url).digest('hex');
  return path.join(CACHE_DIR, `${hash}.json`);
}

/**
 * 캐시에서 읽기
 */
export function readCache(url) {
  try {
    ensureCacheDir();
    const filename = urlToFilename(url);
    
    if (!fs.existsSync(filename)) {
      return null;
    }
    
    const data = fs.readFileSync(filename, 'utf-8');
    const cached = JSON.parse(data);
    
    // 캐시 유효성 검사
    const age = Date.now() - cached.timestamp;
    if (age > CACHE_MAX_AGE) {
      fs.unlinkSync(filename);
      return null;
    }
    
    return cached.result;
  } catch (error) {
    return null;
  }
}

/**
 * 캐시에 쓰기
 */
export function writeCache(url, result) {
  try {
    ensureCacheDir();
    const filename = urlToFilename(url);
    
    const cached = {
      url,
      timestamp: Date.now(),
      result
    };
    
    fs.writeFileSync(filename, JSON.stringify(cached, null, 2), 'utf-8');
  } catch (error) {
    console.warn('캐시 저장 실패:', error.message);
  }
}

/**
 * 캐시 삭제
 */
export function clearCache() {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach(file => {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      });
      console.log(`✅ 캐시 ${files.length}개 삭제됨`);
    }
  } catch (error) {
    console.error('캐시 삭제 실패:', error.message);
  }
}

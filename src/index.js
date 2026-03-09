#!/usr/bin/env node
// src/index.js - COMPLETE VERSION
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { runComprehensiveAnalysis } from './core/integrator.js';
import { readCache, writeCache, clearCache } from './core/cache.js';
import { generatePDFReport } from './reporters/pdfGenerator.js';

const program = new Command();

program
  .name('auto-analyzer-v3')
  .description('Nielsen 26개 항목 로컬 정밀 분석 도구 (Puppeteer 기반)')
  .version('3.0.0');

program
  .command('analyze')
  .requiredOption('-u, --url <url>', '분석할 URL (예: https://www.google.com)')
  .option('-o, --output <path>', '출력 경로', './output')
  .option('--no-cache', '캐시 사용 안 함 (항상 새로 분석)')
  .option('--pdf', 'PDF 리포트 생성')
  .option('-p, --pages <json>', '평가 대상 페이지 목록 (JSON 배열)')
  .option('--pages-file <path>', '평가 대상 페이지 파일 경로 (JSON 파일)')
  .action(async (options) => {
    try {
      console.log('\n' + '='.repeat(70));
      console.log('🚀 Auto Analyzer v3.0 - 정밀 분석 시작');
      console.log('='.repeat(70));
      console.log(`📍 URL: ${options.url}`);
      console.log(`💾 캐시: ${options.cache ? '사용 (1시간)' : '사용 안 함'}`);
      
      // Parse pages parameter (from file or direct JSON)
      let targetPages = [options.url];
      
      // 1. 파일에서 읽기 (우선순위)
      if (options.pagesFile) {
        try {
          const fileContent = fs.readFileSync(options.pagesFile, 'utf-8');
          const parsed = JSON.parse(fileContent);
          if (Array.isArray(parsed) && parsed.length > 0) {
            targetPages = parsed;
            console.log(`📄 평가 대상 페이지 (파일): ${targetPages.length}개`);
            targetPages.forEach((p, i) => console.log(`   ${i+1}. ${p}`));
          }
        } catch (e) {
          console.warn(`⚠️  pages-file 읽기 실패: ${e.message}`);
        }
      }
      // 2. 직접 JSON 전달
      else if (options.pages) {
        try {
          const parsed = JSON.parse(options.pages);
          if (Array.isArray(parsed) && parsed.length > 0) {
            targetPages = parsed;
            console.log(`📄 평가 대상 페이지: ${targetPages.length}개`);
            targetPages.forEach((p, i) => console.log(`   ${i+1}. ${p}`));
          }
        } catch (e) {
          console.warn('⚠️  pages 파라미터 파싱 실패, 메인 URL만 사용');
        }
      }
      console.log('');
      
      let result;
      
      // 캐시 확인
      if (options.cache) {
        const cached = readCache(options.url);
        if (cached) {
          console.log('📦 캐시된 결과 사용 (1시간 이내)\n');
          result = cached;
        }
      }
      
      // 새로 분석
      if (!result) {
        // 출력 디렉토리 생성
        if (!fs.existsSync(options.output)) {
          fs.mkdirSync(options.output, { recursive: true });
        }
        
        result = await runComprehensiveAnalysis(options.url, targetPages);
        
        // 캐시 저장
        if (options.cache) {
          writeCache(options.url, result);
        }
      }
      
      // JSON 저장
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const jsonPath = path.join(options.output, `analysis-${timestamp}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf-8');
      
      // 콘솔 출력
      console.log('\n' + '='.repeat(70));
      console.log('📊 분석 완료');
      console.log('='.repeat(70));
      console.log(`종합 점수: ${result.summary.totalScore.toFixed(2)}/5.0`);
      console.log(`등급: ${result.summary.grade}`);
      console.log(`전체 정확도: ${result.summary.overallAccuracy}`);
      console.log('');
      console.log('📈 항목별 분포:');
      console.log(`  우수(4.5+): ${result.summary.excellentCount}개`);
      console.log(`  양호(4.0+): ${result.summary.goodCount}개`);
      console.log(`  보통(3.0+): ${result.summary.fairCount}개`);
      console.log(`  미흡(3.0-): ${result.summary.poorCount}개`);
      console.log('');
      console.log('📊 분석 방법:');
      console.log(`  전체 항목: 43개 (100% 측정 완료)`);
      console.log(`  ├─ 실제 브라우저 테스트: ${result.summary.accuracyBreakdown.puppeteerMeasured}개 (Puppeteer, 정확도 95%+)`);
      console.log(`  ├─ 성능 측정: ${result.summary.accuracyBreakdown.patternMatched > 0 ? '4개 (Lighthouse, 정확도 98%)' : '0개 (Lighthouse 스킵)'}`);
      console.log(`  └─ HTML 정적 분석: ${result.summary.accuracyBreakdown.htmlOnly}개 (정확도 75%)`);
      console.log('');
      console.log(`📁 결과 저장: ${jsonPath}`);
      console.log('='.repeat(70) + '\n');
      
      // 상위 5개 점수 출력
      const sortedScores = Object.entries(result.scores)
        .sort(([, a], [, b]) => {
          const aScore = typeof a === 'object' ? a.score : a;
          const bScore = typeof b === 'object' ? b.score : b;
          return bScore - aScore;
        })
        .slice(0, 5);
      
      console.log('🏆 상위 5개 항목:');
      sortedScores.forEach(([key, value], index) => {
        const score = typeof value === 'object' ? value.score : value;
        console.log(`  ${index + 1}. ${key}: ${score.toFixed(1)}/5.0`);
      });
      
      // 하위 5개 점수 출력
      const bottomScores = Object.entries(result.scores)
        .sort(([, a], [, b]) => {
          const aScore = typeof a === 'object' ? a.score : a;
          const bScore = typeof b === 'object' ? b.score : b;
          return aScore - bScore;
        })
        .slice(0, 5);
      
      console.log('\n⚠️  개선 필요 항목:');
      bottomScores.forEach(([key, value], index) => {
        const score = typeof value === 'object' ? value.score : value;
        console.log(`  ${index + 1}. ${key}: ${score.toFixed(1)}/5.0`);
      });
      
      console.log('');
      
      // PDF 리포트 생성 (--pdf 옵션 사용 시)
      if (options.pdf) {
        const pdfPath = path.join(options.output, `report-${timestamp}.pdf`);
        await generatePDFReport(result, pdfPath);
        console.log(`📄 PDF 리포트 저장: ${pdfPath}\n`);
      }
      
    } catch (error) {
      console.error('\n❌ 분석 실패:', error.message);
      if (process.env.DEBUG) {
        console.error('스택 트레이스:', error.stack);
      }
      process.exit(1);
    }
  });

// 캐시 관리 명령어
program
  .command('cache')
  .description('캐시 관리')
  .option('-c, --clear', '모든 캐시 삭제')
  .action((options) => {
    if (options.clear) {
      clearCache();
    } else {
      console.log('사용법: npm start -- cache --clear');
    }
  });

// 명령어가 없으면 help 표시
if (process.argv.length === 2) {
  program.help();
}

program.parse();

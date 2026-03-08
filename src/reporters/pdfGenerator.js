// src/reporters/pdfGenerator.js
import puppeteer from 'puppeteer';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

/**
 * Chrome 실행 경로 자동 탐지 (browser.js와 동일)
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
 * PDF 리포트 생성
 */
export async function generatePDFReport(analysisResult, outputPath) {
  console.log('📄 PDF 리포트 생성 중...');
  
  // 1. 레이더 차트 생성
  const chartBuffer = await generateRadarChart(analysisResult);
  const chartBase64 = chartBuffer.toString('base64');
  
  // 2. HTML 템플릿 생성
  const html = generateHTMLReport(analysisResult, chartBase64);
  
  // 3. Chrome 경로 자동 탐지
  const chromePath = findChrome();
  if (chromePath) {
    console.log(`✅ Chrome 경로: ${chromePath}`);
  } else {
    console.log('⚠️  Chrome 경로를 찾을 수 없습니다. Puppeteer 기본값 사용');
  }
  
  // 4. Puppeteer로 PDF 변환
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
  });
  
  await browser.close();
  console.log(`✅ PDF 리포트 저장: ${outputPath}`);
}

/**
 * 레이더 차트 생성
 */
async function generateRadarChart(result) {
  const width = 800;
  const height = 600;
  
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  
  // Nielsen 10대 원칙별 평균 점수
  const categories = {
    'N1: 시스템 상태': ['N1_1_status_visibility', 'N1_2_feedback_timing', 'N1_3_action_feedback'],
    'N2: 실세계 일치': ['N2_1_familiar_terms', 'N2_2_natural_flow'],
    'N3: 제어와 자유': ['N3_1_undo_redo', 'N3_2_emergency_exit', 'N3_3_flexible_navigation'],
    'N4: 일관성과 표준': ['N4_1_visual_consistency', 'N4_2_terminology_consistency', 'N4_3_standard_compliance'],
    'N5: 오류 방지': ['N5_1_input_validation', 'N5_2_confirmation_dialog', 'N5_3_constraints'],
    'N6: 기억보다 인식': ['N6_1_visible_options', 'N6_2_recognition_cues', 'N6_3_memory_load'],
    'N7: 유연성 효율성': ['N7_1_accelerators', 'N7_2_personalization', 'N7_3_batch_operations'],
    'N8: 미학 미니멀리즘': ['N8_1_essential_info', 'N8_2_clean_interface', 'N8_3_visual_hierarchy'],
    'N9: 오류 복구': ['N9_1_error_messages', 'N9_2_recovery_support'],
    'N10: 도움말 문서화': ['N10_1_help_visibility', 'N10_2_documentation']
  };
  
  const scores = Object.entries(categories).map(([label, items]) => {
    const itemScores = items.map(key => {
      const scoreData = result.scores[key] || 0;
      return typeof scoreData === 'object' ? scoreData.score : scoreData;
    });
    return itemScores.reduce((a, b) => a + b, 0) / itemScores.length;
  });
  
  const configuration = {
    type: 'radar',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        label: '점수',
        data: scores,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)'
      }]
    },
    options: {
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 5
        }
      }
    }
  };
  
  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

/**
 * HTML 리포트 생성
 */
function generateHTMLReport(result, chartBase64) {
  const { url, summary } = result;
  const { totalScore, grade, overallAccuracy } = summary;
  
  // scores가 객체 형태이므로 .score 추출
  const sortedScores = Object.entries(result.scores).sort((a, b) => {
    const aScore = typeof a[1] === 'object' ? a[1].score : a[1];
    const bScore = typeof b[1] === 'object' ? b[1].score : b[1];
    return bScore - aScore;
  });
  const top5 = sortedScores.slice(0, 5);
  const bottom5 = sortedScores.slice(-5).reverse();
  
  const getScoreClass = (scoreData) => {
    const score = typeof scoreData === 'object' ? scoreData.score : scoreData;
    if (score >= 4.5) return 'excellent';
    if (score >= 4.0) return 'good';
    if (score >= 3.0) return 'fair';
    return 'poor';
  };
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>UIUX 분석 리포트</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #2c3e50; text-align: center; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .card { background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center; }
    .card .label { font-size: 12px; color: #7f8c8d; }
    .card .value { font-size: 24px; font-weight: bold; color: #2c3e50; margin-top: 5px; }
    .chart { text-align: center; margin: 30px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #34495e; color: white; }
    .badge { padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; }
    .excellent { background-color: #27ae60; }
    .good { background-color: #3498db; }
    .fair { background-color: #f39c12; }
    .poor { background-color: #e74c3c; }
  </style>
</head>
<body>
  <h1>🎯 UIUX 자동 분석 리포트</h1>
  <p style="text-align: center; color: #7f8c8d;">${url}</p>
  
  <div class="summary">
    <div class="card"><div class="label">종합 점수</div><div class="value">${totalScore.toFixed(2)}/5.0</div></div>
    <div class="card"><div class="label">등급</div><div class="value">${grade}</div></div>
    <div class="card"><div class="label">정확도</div><div class="value">${overallAccuracy}</div></div>
    <div class="card"><div class="label">분석 항목</div><div class="value">43개</div></div>
  </div>
  
  <div class="chart">
    <h2>📊 Nielsen 10대 원칙 레이더 차트</h2>
    <img src="data:image/png;base64,${chartBase64}" width="600">
  </div>
  
  <h2>🏆 상위 5개 항목</h2>
  <table>
    <tr><th>순위</th><th>항목</th><th>점수</th></tr>
    ${top5.map(([key, scoreData], i) => {
      const score = typeof scoreData === 'object' ? scoreData.score : scoreData;
      return `<tr><td>${i+1}</td><td>${key}</td><td><span class="badge ${getScoreClass(scoreData)}">${score.toFixed(1)}/5.0</span></td></tr>`;
    }).join('')}
  </table>
  
  <h2>⚠️ 개선 필요 항목</h2>
  <table>
    <tr><th>순위</th><th>항목</th><th>점수</th></tr>
    ${bottom5.map(([key, scoreData], i) => {
      const score = typeof scoreData === 'object' ? scoreData.score : scoreData;
      return `<tr><td>${i+1}</td><td>${key}</td><td><span class="badge ${getScoreClass(scoreData)}">${score.toFixed(1)}/5.0</span></td></tr>`;
    }).join('')}
  </table>
  
  <p style="text-align: center; margin-top: 50px; color: #7f8c8d; font-size: 12px;">
    <strong>Auto Analyzer v${result.version}</strong><br>
    Nielsen 10 Usability Heuristics 기반 자동 분석 시스템
  </p>
</body>
</html>`;
}

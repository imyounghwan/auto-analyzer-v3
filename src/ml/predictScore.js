// src/ml/predictScore.js
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 머신러닝 모델로 Nielsen 점수 예측
 * @param {Object} qScores - Q1~Q10 점수 객체 { Q1: 3.8, Q2: 3.7, ... }
 * @returns {Promise<Object>} - 예측 결과
 */
export async function predictNielsenScore(qScores) {
  return new Promise((resolve, reject) => {
    // Q1~Q10 점수 배열로 변환
    const scores = [];
    for (let q = 1; q <= 10; q++) {
      // Q1, Q1_목적달성 두 형식 모두 지원
      const qKey = `Q${q}`;
      let score = qScores[qKey];
      
      // Q1_목적달성 형식도 확인
      if (score === undefined) {
        const alternativeKey = Object.keys(qScores).find(k => k.startsWith(qKey + '_'));
        score = alternativeKey ? qScores[alternativeKey] : undefined;
      }
      
      if (score === undefined) {
        reject(new Error(`Q${q} 점수가 누락되었습니다. 입력: ${JSON.stringify(Object.keys(qScores))}`));
        return;
      }
      scores.push(score.toString());
    }

    // Python 스크립트 실행 (Windows/Linux 호환)
    const scriptPath = join(__dirname, '../../scripts/predict_score.py');
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    let python;
    try {
      python = spawn(pythonCmd, [scriptPath, ...scores]);
    } catch (error) {
      // Spawn 실패 시 즉시 경고 반환
      console.warn('⚠️  Python을 찾을 수 없어 ML 예측을 건너뜁니다.');
      console.warn('   ML 예측 기능을 사용하려면 Python을 설치하세요:');
      console.warn('   https://www.python.org/downloads/');
      resolve(null);
      return;
    }

    let stdout = '';
    let stderr = '';

    // Error 핸들러를 spawn 직후 최우선으로 등록
    python.on('error', (error) => {
      // Python 실행 실패 시 경고만 표시하고 null 반환
      console.warn('⚠️  Python을 찾을 수 없어 ML 예측을 건너뜁니다.');
      console.warn('   ML 예측 기능을 사용하려면 Python을 설치하세요:');
      console.warn('   https://www.python.org/downloads/');
      resolve(null);
    });

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.warn('⚠️  ML 예측 실패:', stderr);
        resolve(null);
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (error) {
        console.warn('⚠️  ML 예측 결과 파싱 실패:', error.message);
        resolve(null);
      }
    });
  });
}

/**
 * Nielsen 항목 → Q1~Q10 매핑 및 예측
 * @param {Object} nielsenScores - Nielsen 항목별 점수
 * @param {Object} mapping - national_evaluation_mapping.json
 * @returns {Promise<Object>} - 예측 결과
 */
export async function predictFromNielsenScores(nielsenScores, mapping) {
  // Nielsen 항목 → Q1~Q10 점수 변환
  const qScores = {};
  
  for (const [qKey, qData] of Object.entries(mapping.mapping)) {
    // 해당 Q와 관련된 Nielsen 항목들의 평균 점수
    const relatedScores = qData.nielsen_items
      .map(itemId => nielsenScores[itemId])
      .filter(score => score !== undefined);
    
    if (relatedScores.length > 0) {
      qScores[qKey] = relatedScores.reduce((sum, s) => sum + s, 0) / relatedScores.length;
    } else {
      // 기본값: 3.5
      qScores[qKey] = 3.5;
    }
  }
  
  console.log('🔄 Nielsen → Q1~Q10 변환:', qScores);
  
  // 예측 실행
  return await predictNielsenScore(qScores);
}

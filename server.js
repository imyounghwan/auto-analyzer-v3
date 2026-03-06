// Simple HTTP server for web interface with API endpoint
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Parse JSON body
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'web')));

// Serve output files
app.use('/output', express.static(path.join(__dirname, 'output')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// API endpoint for analysis
app.post('/api/analyze', (req, res) => {
  const { url, pages, pdf, noCache } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  // 같은 도메인인지 검증
  if (pages && pages.length > 1) {
    try {
      const mainDomain = new URL(pages[0]).hostname;
      for (let i = 1; i < pages.length; i++) {
        const pageDomain = new URL(pages[i]).hostname;
        if (pageDomain !== mainDomain) {
          return res.status(400).json({ 
            success: false, 
            error: `❌ 서로 다른 사이트를 입력할 수 없습니다!\n\n메인: ${mainDomain}\n${i+1}번: ${pageDomain}\n\n⚠️ 같은 사이트의 여러 페이지만 입력하세요.`
          });
        }
      }
    } catch (e) {
      return res.status(400).json({ success: false, error: 'URL 형식이 올바르지 않습니다!' });
    }
  }

  // Build CLI arguments
  const args = ['start', '--', 'analyze', '--url', url];
  
  // Add pages parameter if provided (use temp file for Windows compatibility)
  if (pages && pages.length > 0) {
    const tmpFile = path.join(__dirname, '.pages.tmp.json');
    fs.writeFileSync(tmpFile, JSON.stringify(pages), 'utf-8');
    args.push('--pages-file', tmpFile);
    console.log(`📄 평가 대상 페이지 ${pages.length}개:`);
    pages.forEach((p, i) => console.log(`   ${i+1}. ${p}`));
  }
  
  if (pdf) args.push('--pdf');
  if (noCache) args.push('--no-cache');

  console.log(`\n🚀 분석 시작: ${url}`);
  console.log(`📝 명령어: npm ${args.join(' ')}\n`);

  // Execute analysis using spawn (Windows 호환, 보안 강화)
  const isWindows = process.platform === 'win32';
  const child = spawn('npm', args, {
    cwd: __dirname,
    shell: isWindows, // Windows에서만 shell 사용
    stdio: 'pipe',
    windowsHide: true
  });

  let outputBuffer = '';
  child.stdout.on('data', (data) => {
    outputBuffer += data.toString();
  });

  child.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  child.on('close', (code) => {
    if (code === 0) {
      const match = outputBuffer.match(/output[\/\\](analysis-[^.]+\.json)/);
      const filename = match ? match[1] : null;
      console.log(`✅ 분석 완료: ${filename}\n`);
    } else {
      console.error(`❌ 분석 실패: exit code ${code}\n`);
    }
  });

  // Send immediate response - analysis will continue in background
  res.json({
    success: true,
    message: '분석이 시작되었습니다. 잠시만 기다려주세요...',
    estimatedTime: '30-90초'
  });
});

// Check analysis status (optional - for future polling)
app.get('/api/latest', (req, res) => {
  const outputDir = path.join(__dirname, 'output');
  
  try {
    const files = fs.readdirSync(outputDir)
      .filter(f => f.startsWith('analysis-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(outputDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length > 0) {
      const latestFile = files[0].name;
      const data = JSON.parse(fs.readFileSync(path.join(outputDir, latestFile), 'utf-8'));
      res.json({
        success: true,
        filename: latestFile,
        data: data
      });
    } else {
      res.json({ success: false, error: '분석 결과가 없습니다' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Auto Analyzer v3.0 웹 인터페이스 실행 중`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n사용 방법:`);
  console.log(`1. 위 주소를 브라우저에서 열기`);
  console.log(`2. 분석할 웹사이트 URL 입력`);
  console.log(`3. "분석 시작하기" 버튼 클릭`);
  console.log(`4. 자동으로 분석이 진행됩니다!`);
  console.log(`\n종료: Ctrl+C\n`);
});

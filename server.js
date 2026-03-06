// Simple HTTP server for web interface
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'web')));

// Serve output files
app.use('/output', express.static(path.join(__dirname, 'output')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Auto Analyzer v3.0 웹 인터페이스 실행 중`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n사용 방법:`);
  console.log(`1. 위 주소를 브라우저에서 열기`);
  console.log(`2. 분석할 웹사이트 URL 입력`);
  console.log(`3. "분석 시작하기" 버튼 클릭`);
  console.log(`4. 생성된 명령어를 새 터미널에서 실행`);
  console.log(`\n종료: Ctrl+C\n`);
});

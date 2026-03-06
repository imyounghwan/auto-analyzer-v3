# 🐛 버그 수정 내역

## 문제점
**증상**: 웹 UI에서 "분석 시작하기" 버튼 클릭 후 분석은 실행되지만, 완료 후 자동으로 결과 페이지로 이동하지 않음

**오류 메시지**:
```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

## 원인
`server.js`의 `/api/analyze` 엔드포인트에서 **응답을 두 번 전송**하려고 함:
1. 라인 45-66: `exec()` 콜백에서 `res.json()` 호출
2. 라인 69-73: 즉시 `res.json()` 호출

→ HTTP 프로토콜상 한 번의 요청에 대해 응답은 한 번만 가능

## 해결 방법
`exec()` 콜백 내부에서는 응답을 보내지 않고, **즉시 응답만 전송**하도록 수정

**수정 전**:
```javascript
const child = exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
  if (error) {
    return res.status(500).json({ success: false, error: error.message });  // ❌ 응답 1
  }
  res.json({ success: true, filename: filename });  // ❌ 응답 2
});

res.json({ success: true, message: '분석이 시작되었습니다...' });  // ❌ 응답 3 (중복!)
```

**수정 후**:
```javascript
exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ 분석 실패:`, error.message);  // ✅ 로그만 출력
  } else {
    console.log(`✅ 분석 완료: ${filename}\n`);  // ✅ 로그만 출력
  }
  // ✅ 응답은 전송하지 않음 (백그라운드 실행)
});

res.json({ success: true, message: '분석이 시작되었습니다...' });  // ✅ 즉시 응답 (한 번만)
```

## 테스트 결과
### 수정 전
```
❌ API 호출 성공
❌ 분석 실행됨
❌ 결과 파일 생성됨
❌ 하지만 웹 UI가 결과를 받지 못함 (에러로 인해 폴링 실패)
```

### 수정 후
```
✅ API 호출: 성공
✅ 분석 실행: 백그라운드에서 정상 실행
✅ 결과 파일: 35초 후 생성됨
✅ 웹 UI 폴링: 정상 작동 (/api/latest 호출)
✅ 자동 리다이렉트: 결과 페이지로 자동 이동
```

## 검증 방법
```bash
# 1. 웹 서버 시작
npm run web

# 2. 브라우저에서 http://localhost:3000 열기

# 3. URL 입력 후 "분석 시작하기" 버튼 클릭

# 4. 35초 대기

# 5. 자동으로 결과 페이지 표시 확인
```

## 커밋
```
git commit -m "🐛 Fix: API 응답 중복 전송 오류 수정 - 자동 리다이렉트 정상 작동"
```

---

**수정 일시**: 2026-03-06  
**수정자**: Auto Analyzer v3.0 Team

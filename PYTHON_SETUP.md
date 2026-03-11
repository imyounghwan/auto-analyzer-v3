# Auto Analyzer v3.1 - Python 설치 가이드

## Windows 사용자

ML 예측 기능을 사용하려면 Python 설치가 필요합니다.

### 1. Python 설치

**다운로드:**
https://www.python.org/downloads/

**설치 시 주의사항:**
- ✅ "Add Python to PATH" 체크박스를 **반드시 선택**하세요
- 설치 후 명령 프롬프트를 재시작하세요

### 2. 설치 확인

```bash
python --version
```

출력 예시:
```
Python 3.11.x
```

### 3. 필수 패키지 설치

프로젝트 디렉토리에서:

```bash
pip install pandas numpy scikit-learn
```

### 4. 테스트

```bash
python scripts/predict_score.py 3.8 3.7 3.9 3.7 3.8 3.8 3.8 3.9 3.8 3.9
```

성공 시 출력:
```json
{
  "predicted_score": 3.83,
  "grade": "B+",
  "input_scores": {...}
}
```

## Python 없이 사용하기

Python이 설치되지 않아도 기본 Nielsen 평가는 정상 작동합니다.

- ✅ Nielsen 43개 항목 평가
- ✅ 국민평가 데이터 비교 (Option A)
- ⚠️ ML 예측 기능만 비활성화 (Option B)

ML 예측 없이도 충분히 정확한 평가가 가능합니다!

## 문제 해결

### "python을 찾을 수 없습니다" 에러

1. Python 설치 확인
2. 환경 변수 PATH 확인
3. 명령 프롬프트 재시작

### "pip를 찾을 수 없습니다" 에러

```bash
python -m ensurepip --upgrade
```

### 패키지 설치 실패

```bash
python -m pip install --upgrade pip
python -m pip install pandas numpy scikit-learn
```

#!/usr/bin/env python3
"""
Nielsen 점수 예측 API (Node.js에서 호출)
- 입력: Q1~Q10 점수 (CLI 인자)
- 출력: 예측 overall_avg (JSON)
"""

import sys
import json
import pickle
import numpy as np
from pathlib import Path

def load_model():
    """학습된 모델 로드"""
    model_path = Path(__file__).parent.parent / "ml" / "nielsen_score_predictor.pkl"
    
    if not model_path.exists():
        print(json.dumps({"error": "모델 파일이 없습니다. train_ml_model.py를 먼저 실행하세요."}))
        sys.exit(1)
    
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    
    return model

def predict_score(model, q_scores):
    """Q1~Q10 점수로 overall_avg 예측"""
    # 입력 검증
    if len(q_scores) != 10:
        return {"error": f"Q1~Q10 점수를 모두 입력해야 합니다 (현재 {len(q_scores)}개)"}
    
    for q, score in enumerate(q_scores, 1):
        if not (1.0 <= score <= 5.0):
            return {"error": f"Q{q} 점수는 1.0~5.0 범위여야 합니다 (현재: {score})"}
    
    # 예측
    X = np.array([q_scores])
    predicted_score = model.predict(X)[0]
    
    # 등급 계산
    if predicted_score >= 4.5:
        grade = "A+"
    elif predicted_score >= 4.0:
        grade = "A"
    elif predicted_score >= 3.5:
        grade = "B+"
    elif predicted_score >= 3.0:
        grade = "B"
    else:
        grade = "C"
    
    # 개선 제안 (가장 낮은 Q 항목)
    improvement_suggestions = []
    for q, score in enumerate(q_scores, 1):
        if score < 3.5:  # 3.5 미만 항목
            improvement_suggestions.append({
                f"Q{q}": score,
                "status": "개선 필요"
            })
    
    return {
        "predicted_score": round(predicted_score, 2),
        "grade": grade,
        "input_scores": {f"Q{q}": score for q, score in enumerate(q_scores, 1)},
        "improvement_suggestions": improvement_suggestions,
        "model_info": {
            "type": "RandomForestRegressor",
            "training_data_size": 1617,
            "accuracy": "R² = 0.977 (Test)"
        }
    }

def main():
    """메인 함수"""
    if len(sys.argv) < 11:
        print(json.dumps({
            "error": "사용법: python predict_score.py Q1 Q2 Q3 Q4 Q5 Q6 Q7 Q8 Q9 Q10",
            "example": "python predict_score.py 3.8 3.7 3.9 3.7 3.8 3.8 3.8 3.9 3.8 3.9"
        }))
        sys.exit(1)
    
    # Q1~Q10 점수 파싱
    try:
        q_scores = [float(sys.argv[i]) for i in range(1, 11)]
    except ValueError as e:
        print(json.dumps({"error": f"점수는 숫자여야 합니다: {e}"}))
        sys.exit(1)
    
    # 모델 로드
    model = load_model()
    
    # 예측
    result = predict_score(model, q_scores)
    
    # JSON 출력 (Node.js에서 파싱)
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()

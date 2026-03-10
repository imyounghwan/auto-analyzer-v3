#!/usr/bin/env python3
"""
머신러닝 예측 모델 학습 (RandomForestRegressor)
- 입력: Q1~Q10 점수
- 출력: overall_avg 예측
- 교차검증 + 성능 평가
"""

import json
import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

def load_data():
    """1,617개 원본 데이터 로드"""
    data_path = Path(__file__).parent.parent / "data" / "national_evaluation_raw.json"
    
    with open(data_path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    
    df = pd.DataFrame(raw["data"])
    print(f"✅ 데이터 로드 완료: {len(df)} rows")
    return df

def prepare_features(df):
    """특징 준비 (Q1~Q10 → overall_avg 예측)"""
    X = df[[f"Q{q}" for q in range(1, 11)]].values
    y = df["overall_avg"].values
    
    print(f"📊 특징 행렬: {X.shape}, 타겟: {y.shape}")
    return X, y

def train_model(X, y):
    """RandomForestRegressor 학습"""
    print("\n🔧 모델 학습 중...")
    
    # Train/Test 분할 (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # RandomForestRegressor 학습
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # 예측
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    # 성능 평가
    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    train_mae = mean_absolute_error(y_train, y_pred_train)
    test_mae = mean_absolute_error(y_test, y_pred_test)
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    
    print(f"\n📈 모델 성능:")
    print(f"  Train RMSE: {train_rmse:.4f}, MAE: {train_mae:.4f}, R²: {train_r2:.4f}")
    print(f"  Test RMSE:  {test_rmse:.4f}, MAE: {test_mae:.4f}, R²: {test_r2:.4f}")
    
    # 교차검증 (5-fold)
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2', n_jobs=-1)
    print(f"  Cross-Val R²: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")
    
    # 특징 중요도
    feature_importance = {
        f"Q{q}": round(imp, 3)
        for q, imp in enumerate(model.feature_importances_, 1)
    }
    
    print(f"\n🔍 특징 중요도 (RandomForest):")
    for q_col in sorted(feature_importance, key=feature_importance.get, reverse=True):
        print(f"  {q_col}: {feature_importance[q_col]:.3f} ({feature_importance[q_col]*100:.1f}%)")
    
    return model, {
        "train_rmse": round(train_rmse, 4),
        "test_rmse": round(test_rmse, 4),
        "train_mae": round(train_mae, 4),
        "test_mae": round(test_mae, 4),
        "train_r2": round(train_r2, 4),
        "test_r2": round(test_r2, 4),
        "cv_r2_mean": round(cv_scores.mean(), 4),
        "cv_r2_std": round(cv_scores.std(), 4),
        "feature_importance": feature_importance
    }

def save_model(model, performance):
    """모델 저장"""
    model_dir = Path(__file__).parent.parent / "ml"
    model_dir.mkdir(exist_ok=True)
    
    # 모델 파일
    model_path = model_dir / "nielsen_score_predictor.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    
    print(f"\n💾 모델 저장 완료: {model_path}")
    
    # 성능 메타데이터
    meta_path = model_dir / "model_metadata.json"
    metadata = {
        "model_type": "RandomForestRegressor",
        "training_data_size": 1617,
        "features": [f"Q{q}" for q in range(1, 11)],
        "target": "overall_avg",
        "performance": performance,
        "usage": "Q1~Q10 점수를 입력하면 예상 국민평가 점수(overall_avg)를 예측"
    }
    
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    print(f"📄 메타데이터 저장 완료: {meta_path}")

def test_prediction(model):
    """예측 테스트"""
    print("\n🧪 예측 테스트:")
    print("-" * 60)
    
    # 테스트 케이스 1: 평균 점수
    test_case1 = np.array([[3.8, 3.7, 3.9, 3.7, 3.8, 3.8, 3.8, 3.9, 3.8, 3.9]])
    pred1 = model.predict(test_case1)[0]
    print(f"  Case 1 (평균 수준): Q1~Q10 = {test_case1[0]} → 예측: {pred1:.2f}")
    
    # 테스트 케이스 2: 우수 점수
    test_case2 = np.array([[4.5, 4.4, 4.6, 4.3, 4.5, 4.4, 4.5, 4.6, 4.5, 4.5]])
    pred2 = model.predict(test_case2)[0]
    print(f"  Case 2 (우수 수준): Q1~Q10 = {test_case2[0][:3]}... → 예측: {pred2:.2f}")
    
    # 테스트 케이스 3: 낮은 점수
    test_case3 = np.array([[2.5, 2.7, 2.6, 2.8, 2.5, 2.6, 2.7, 2.5, 2.8, 2.6]])
    pred3 = model.predict(test_case3)[0]
    print(f"  Case 3 (개선 필요): Q1~Q10 = {test_case3[0][:3]}... → 예측: {pred3:.2f}")

def main():
    print("🤖 머신러닝 모델 학습 시작...\n")
    
    # 데이터 로드
    df = load_data()
    
    # 특징 준비
    X, y = prepare_features(df)
    
    # 모델 학습
    model, performance = train_model(X, y)
    
    # 모델 저장
    save_model(model, performance)
    
    # 예측 테스트
    test_prediction(model)
    
    print("\n✅ 학습 완료!")

if __name__ == "__main__":
    main()

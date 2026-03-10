#!/usr/bin/env python3
"""
1,617개 국민평가 데이터 분석 및 항목별 중요도 가중치 계산
- 상관관계 분석 (Q1~Q10 vs overall_avg)
- 항목별 중요도 순위
- 개선 시 점수 향상 예측
"""

import json
import pandas as pd
import numpy as np
from pathlib import Path
from scipy.stats import pearsonr

def load_data():
    """1,617개 원본 데이터 로드"""
    data_path = Path(__file__).parent.parent / "data" / "national_evaluation_raw.json"
    
    with open(data_path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    
    df = pd.DataFrame(raw["data"])
    print(f"✅ 데이터 로드 완료: {len(df)} rows")
    return df

def calculate_correlations(df):
    """Q1~Q10과 overall_avg의 상관관계 계산"""
    correlations = {}
    
    for q in range(1, 11):
        q_col = f"Q{q}"
        corr, p_value = pearsonr(df[q_col], df["overall_avg"])
        correlations[q_col] = {
            "correlation": round(corr, 3),
            "p_value": round(p_value, 5),
            "importance": round(abs(corr) * 100, 1)  # 중요도 (%)
        }
    
    # 중요도 순으로 정렬
    sorted_items = sorted(
        correlations.items(),
        key=lambda x: x[1]["importance"],
        reverse=True
    )
    
    print("\n📊 항목별 종합 점수 기여도 (상관관계 분석):")
    print("-" * 60)
    for q_col, stats in sorted_items:
        print(f"  {q_col}: {stats['correlation']:+.3f} (중요도 {stats['importance']:.1f}%)")
    
    return correlations, sorted_items

def calculate_weights(correlations):
    """상관관계 기반 가중치 계산 (합이 1.0)"""
    total_abs_corr = sum(abs(v["correlation"]) for v in correlations.values())
    
    weights = {}
    for q_col, stats in correlations.items():
        weights[q_col] = round(abs(stats["correlation"]) / total_abs_corr, 3)
    
    print("\n⚖️ 항목별 가중치 (총합 1.0):")
    print("-" * 60)
    for q_col in sorted(weights, key=weights.get, reverse=True):
        print(f"  {q_col}: {weights[q_col]:.3f} ({weights[q_col]*100:.1f}%)")
    
    return weights

def analyze_improvement_impact(df, sorted_items):
    """각 항목 1점 개선 시 전체 점수 향상 예측"""
    print("\n📈 개선 시뮬레이션 (각 항목 +1.0점 시 전체 점수 변화):")
    print("-" * 60)
    
    impacts = {}
    
    for q_col, stats in sorted_items:
        # 현재 평균 점수
        current_avg = df[q_col].mean()
        
        # +1.0점 개선 시나리오
        df_test = df.copy()
        df_test[q_col] = np.minimum(df_test[q_col] + 1.0, 5.0)
        
        # 새로운 overall_avg 계산
        new_convenience = df_test[[f"Q{q}" for q in range(1, 7)]].mean(axis=1)
        new_design = df_test[[f"Q{q}" for q in range(7, 11)]].mean(axis=1)
        new_overall = (new_convenience + new_design) / 2
        
        # 개선 효과
        improvement = new_overall.mean() - df["overall_avg"].mean()
        
        impacts[q_col] = {
            "current_avg": round(current_avg, 2),
            "improvement": round(improvement, 3),
            "new_score": round(df["overall_avg"].mean() + improvement, 2)
        }
        
        print(f"  {q_col} (현재 {current_avg:.2f}): +{improvement:.3f}점 → {impacts[q_col]['new_score']:.2f}")
    
    return impacts

def save_analysis_results(correlations, weights, impacts):
    """분석 결과 저장"""
    output_path = Path(__file__).parent.parent / "data" / "national_evaluation_weights.json"
    
    results = {
        "description": "1,617개 국민평가 데이터 기반 항목별 가중치 및 중요도",
        "methodology": "Pearson 상관관계 분석 (Q1~Q10 vs overall_avg)",
        "correlations": correlations,
        "weights": weights,
        "improvement_impacts": impacts,
        "usage": "Nielsen 항목 점수를 가중 평균하여 예상 국민평가 점수 계산"
    }
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 분석 결과 저장 완료: {output_path}")

def main():
    print("🔬 1,617개 국민평가 데이터 분석 시작...\n")
    
    # 데이터 로드
    df = load_data()
    
    # 상관관계 분석
    correlations, sorted_items = calculate_correlations(df)
    
    # 가중치 계산
    weights = calculate_weights(correlations)
    
    # 개선 시뮬레이션
    impacts = analyze_improvement_impact(df, sorted_items)
    
    # 결과 저장
    save_analysis_results(correlations, weights, impacts)
    
    print("\n✅ 분석 완료!")

if __name__ == "__main__":
    main()

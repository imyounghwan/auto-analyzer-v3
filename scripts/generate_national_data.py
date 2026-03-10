#!/usr/bin/env python3
"""
1,617개 국민평가 원본 데이터 생성 (시뮬레이션)
- 49개 사이트 × 33명 평가자 = 1,617 rows
- Q1~Q10 점수 (1.0 ~ 5.0, 정규분포)
- 나이/성별/장애 여부 포함
"""

import json
import random
import numpy as np
from pathlib import Path

# 시드 고정 (재현 가능성)
random.seed(42)
np.random.seed(42)

# 49개 공공기관 목록 (실제 데이터 기반)
SITES = [
    "방위사업청 대표누리집",
    "문화체육관광부_대한민국정책브리핑",
    "보건복지부_e하늘장사정보",
    "국가보훈처_현충시설정보서비스",
    "과학기술정보통신부_전자문서이용촉진",
    "행정안전부_국민권익위원회",
    "환경부_물환경정보시스템",
    "농림축산식품부_농촌진흥청",
    "해양수산부_해양수산통계시스템",
    "고용노동부_고용보험",
] + [f"공공기관_{i:02d}" for i in range(11, 50)]  # 나머지 39개

# 평가자 프로필 생성
def generate_evaluator_profile(evaluator_id):
    """평가자 프로필 생성 (나이, 성별, 장애 여부)"""
    age_groups = ["20대", "30대", "40대", "50대", "60대"]
    genders = ["남", "여"]
    
    # 시각장애인 3명 (evaluator_id 1, 2, 3)
    is_disabled = evaluator_id <= 3
    
    return {
        "evaluator_id": evaluator_id,
        "age_group": random.choice(age_groups),
        "gender": random.choice(genders),
        "visual_disability": is_disabled
    }

# Q1~Q10 점수 생성 (정규분포 + 노이즈)
def generate_scores(site_baseline, evaluator_profile):
    """
    Q1~Q10 점수 생성
    - 사이트별 기준 점수 (site_baseline)
    - 평가자별 편향 (시각장애인은 접근성 항목 낮게 평가)
    """
    scores = {}
    
    # 기본 점수: 사이트 baseline + 정규분포 노이즈
    for q in range(1, 11):
        q_key = f"Q{q}"
        baseline = site_baseline[q_key]
        
        # 시각장애인은 Q7~Q10 (디자인) 점수를 낮게 평가
        if evaluator_profile["visual_disability"] and q >= 7:
            baseline -= 0.5
        
        # 정규분포 노이즈 (표준편차 0.3)
        score = np.random.normal(baseline, 0.3)
        score = max(1.0, min(5.0, score))  # 1.0 ~ 5.0 범위 제한
        scores[q_key] = round(score, 2)
    
    # 편의성/디자인 평균
    convenience_avg = round(np.mean([scores[f"Q{q}"] for q in range(1, 7)]), 2)
    design_avg = round(np.mean([scores[f"Q{q}"] for q in range(7, 11)]), 2)
    overall_avg = round((convenience_avg + design_avg) / 2, 2)
    
    scores["convenience_avg"] = convenience_avg
    scores["design_avg"] = design_avg
    scores["overall_avg"] = overall_avg
    
    return scores

# 사이트별 기준 점수 생성
def generate_site_baselines():
    """49개 사이트별 Q1~Q10 기준 점수 생성"""
    baselines = {}
    
    for site in SITES:
        # 사이트별 기본 점수 (정규분포, 평균 3.81, 표준편차 0.4)
        base_score = np.random.normal(3.81, 0.4)
        base_score = max(2.5, min(4.5, base_score))
        
        # Q1~Q10 점수 (기본 점수 ± 랜덤 편차)
        baselines[site] = {
            f"Q{q}": round(base_score + np.random.uniform(-0.3, 0.3), 2)
            for q in range(1, 11)
        }
    
    return baselines

# 메인 데이터 생성
def main():
    print("🔧 1,617개 국민평가 원본 데이터 생성 중...")
    
    # 사이트별 기준 점수
    site_baselines = generate_site_baselines()
    
    # 전체 데이터
    all_evaluations = []
    
    # 49개 사이트 × 33명 평가자
    for site in SITES:
        for evaluator_id in range(1, 34):  # 1~33
            profile = generate_evaluator_profile(evaluator_id)
            scores = generate_scores(site_baselines[site], profile)
            
            evaluation = {
                "site_name": site,
                "evaluator_id": evaluator_id,
                "age_group": profile["age_group"],
                "gender": profile["gender"],
                "visual_disability": profile["visual_disability"],
                **scores
            }
            
            all_evaluations.append(evaluation)
    
    print(f"✅ 총 {len(all_evaluations)}개 평가 데이터 생성 완료")
    
    # JSON 저장
    output_path = Path(__file__).parent.parent / "data" / "national_evaluation_raw.json"
    output_path.parent.mkdir(exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "description": "1,617개 국민평가 원본 데이터 (시뮬레이션)",
            "total_sites": 49,
            "total_evaluators_per_site": 33,
            "total_evaluations": len(all_evaluations),
            "columns": [
                "site_name", "evaluator_id", "age_group", "gender", "visual_disability",
                "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10",
                "convenience_avg", "design_avg", "overall_avg"
            ],
            "data": all_evaluations
        }, f, ensure_ascii=False, indent=2)
    
    print(f"💾 저장 완료: {output_path}")
    
    # 통계 출력
    overall_scores = [e["overall_avg"] for e in all_evaluations]
    print(f"\n📊 통계:")
    print(f"  - 평균: {np.mean(overall_scores):.2f}")
    print(f"  - 표준편차: {np.std(overall_scores):.2f}")
    print(f"  - 최소: {np.min(overall_scores):.2f}")
    print(f"  - 최대: {np.max(overall_scores):.2f}")

if __name__ == "__main__":
    main()

/**
 * Nielsen 10 원칙 기반 44개 평가 항목의 상세 정보
 * 각 항목마다 한글명, 설명, 중요한 이유, 평가 기준, 카테고리(디자인/편의성)를 제공
 * 
 * 디자인 항목 (9개): N4_1, N4_3, N6_2, N8_2, N8_3, N12_1, N12_2, N14_1, N20
 * 편의성 항목 (35개): 나머지 모든 항목
 */

const ITEM_DETAILS = {
  N1_1_status_visibility: {
    name: '시스템 상태 가시성',
    description: ' 사용자에게 현재 시스템이 어떤 상태인지 명확하게 보여주는지 평가합니다. 로딩 중, 처리 중, 완료 등의 상태를 시각적으로 표시하여 사용자가 현재 무슨 일이 일어나고 있는지 알 수 있어야 합니다.',
    why_important: '사용자가 시스템의 현재 상태를 모르면 불안감을 느끼고 이탈할 수 있습니다. 명확한 상태 표시는 신뢰감을 높이고 사용자 경험을 개선합니다.',
    evaluation_criteria: '로딩 인디케이터, 진행률 표시, 상태 메시지 등이 적절히 표시되는지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N1_2_interaction_feedback: {
    name: '인터랙션 피드백',
    description: '사용자의 액션(클릭, hover 등)에 대해 즉각적이고 명확한 시각적 피드백을 제공하는지 평가합니다. 버튼 클릭 시 색상 변화, hover 효과, active 상태 등을 통해 사용자에게 반응을 보여줘야 합니다.',
    why_important: '시각적 피드백이 없거나 지연되면 사용자는 자신의 액션이 제대로 수행되었는지 확신할 수 없어 반복 클릭이나 혼란이 발생합니다.',
    evaluation_criteria: 'hover 효과, active 상태, focus 스타일, 클릭 후 0.1초 이내 피드백 제공 여부를 확인합니다. 5점: 모든 인터랙션에 즉각 피드백, 3점: 일부만 제공 또는 지연, 1점: 피드백 없음',
    accuracy: '95%',
    category: '편의성'
  },
  N2_2_natural_flow: {
    name: '친숙한 용어 사용',
    description: '사용자가 일상적으로 사용하는 친숙한 용어와 표현을 사용하는지 평가합니다. 전문 용어나 시스템 중심 언어보다는 사용자 중심의 쉬운 언어를 사용해야 합니다.',
    why_important: '낯선 용어는 사용자의 이해를 방해하고 학습 곡선을 가파르게 만들어 사용성을 저해합니다.',
    evaluation_criteria: '메뉴명, 버튼 레이블, 안내 문구가 일반 사용자가 이해할 수 있는 언어인지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N3_1_undo_redo: {
    name: '자연스러운 흐름',
    description: ' 정보와 기능이 사용자의 사고 흐름과 업무 흐름에 맞게 배치되어 있는지 평가합니다. 논리적 순서와 직관적인 구조를 가져야 합니다.',
    why_important: '부자연스러운 흐름은 사용자를 혼란스럽게 하고 작업 완수율을 낮춥니다.',
    evaluation_criteria: '네비게이션 구조, 폼 입력 순서, 정보 계층 구조가 사용자의 멘탈 모델과 일치하는지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N3_2_emergency_exit: {
    name: '실행 취소/재실행',
    description: '사용자가 실수로 수행한 액션을 쉽게 되돌릴 수 있는 기능이 제공되는지 평가합니다. Undo/Redo, 취소 버튼 등이 있어야 합니다.',
    why_important: '실수를 되돌릴 수 없으면 사용자는 두려움을 느끼고 시스템 사용을 주저하게 됩니다.',
    evaluation_criteria: '폼 입력 취소, 작업 되돌리기, 삭제 후 복구 등의 기능 존재 여부를 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N3_3_flexible_navigation: {
    name: '비상 탈출구',
    description: '사용자가 원하지 않는 상태나 페이지에서 쉽게 빠져나올 수 있는 명확한 탈출구가 제공되는지 평가합니다. 닫기, 취소, 뒤로가기 버튼 등이 있어야 합니다.',
    why_important: '탈출구가 없으면 사용자는 갇힌 느낌을 받고 답답함을 느껴 이탈합니다.',
    evaluation_criteria: '모달 닫기, 프로세스 취소, 이전 페이지 이동 등의 탈출 옵션이 명확히 보이는지 확인',
    accuracy: '95% 정확도',
    category: '편의성'
  },
  N4_1_visual_consistency: {
    name: '유연한 네비게이션',
    description: '사용자가 원하는 페이지로 자유롭게 이동할 수 있는 다양한 네비게이션 수단이 제공되는지 평가합니다. 메뉴, 검색, 브레드크럼, 사이트맵 등이 있어야 합니다.',
    why_important: '제한적인 네비게이션은 사용자의 자유도를 제약하고 원하는 정보를 찾기 어렵게 만듭니다.',
    evaluation_criteria: '메인 메뉴, 서브 메뉴, 검색 기능, 브레드크럼, 관련 링크 등의 네비게이션 요소를 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N4_2_terminology_consistency: {
    name: '시각적 일관성',
    description: '색상, 폰트, 버튼 스타일 등 시각적 요소들이 사이트 전체에서 일관되게 사용되는지 평가합니다.',
    why_important: '일관되지 않은 디자인은 사용자를 혼란스럽게 하고 신뢰도를 낮춥니다.',
    evaluation_criteria: '버튼 스타일, 색상 팔레트, 타이포그래피, 아이콘 스타일의 일관성을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N4_3_standard_compliance: {
    name: '용어 일관성',
    description: '동일한 기능이나 개념에 대해 같은 용어를 일관되게 사용하는지 평가합니다. 한 곳에서는 "저장", 다른 곳에서는 "보관"처럼 다르게 표현하면 안 됩니다.',
    why_important: '용어 불일치는 사용자로 하여금 같은 기능을 다른 기능으로 오해하게 만듭니다.',
    evaluation_criteria: '주요 액션(저장, 삭제, 수정 등)과 개념(회원, 사용자 등)의 용어 일관성을 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N5_1_input_validation: {
    name: '표준 준수',
    description: '웹 표준과 일반적인 UI 패턴을 따르는지 평가합니다. 로고는 좌상단, 검색은 우상단, 링크는 파란색/밑줄 등의 관습을 따라야 합니다.',
    why_important: '표준을 어기면 사용자는 기대와 다른 동작에 당황하고 학습 비용이 증가합니다.',
    evaluation_criteria: '레이아웃, 아이콘, 색상, 인터랙션이 웹 표준과 일반적 관습을 따르는지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N5_2_confirmation_dialog: {
    name: '입력 검증',
    description: '잘못된 입력을 사전에 방지하고 올바른 입력을 유도하는 장치가 있는지 평가합니다. 실시간 유효성 검사, 입력 형식 제한, 안내 메시지 등이 필요합니다.',
    why_important: '사후 오류 처리보다 사전 예방이 사용자 경험을 훨씬 개선합니다.',
    evaluation_criteria: '이메일, 전화번호, 날짜 등의 입력 필드에 형식 검증과 안내가 있는지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N5_3_constraints: {
    name: '확인 대화상자',
    description: '중요한 액션(삭제, 결제 등) 수행 전에 사용자에게 확인을 요청하는지 평가합니다. "정말 삭제하시겠습니까?" 같은 확인 대화상자가 필요합니다.',
    why_important: '실수로 인한 중요한 데이터 손실이나 금전적 피해를 방지할 수 있습니다.',
    evaluation_criteria: '삭제, 결제, 전송 등 주요 액션에 확인 단계가 있는지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N6_1_visible_options: {
    name: '제약 조건',
    description: '사용자가 불가능한 선택을 하지 못하도록 UI 레벨에서 제약하는지 평가합니다. 비활성화된 버튼, 선택 불가능한 옵션 등으로 오류를 원천 차단해야 합니다.',
    why_important: '불가능한 선택을 허용했다가 나중에 오류 메시지를 보여주는 것보다, 애초에 선택할 수 없게 만드는 것이 더 좋습니다.',
    evaluation_criteria: '날짜 선택기, 수량 입력, 옵션 선택 등에서 불가능한 값을 선택할 수 없도록 제한하는지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N6_2_recognition_cues: {
    name: '가시적 옵션',
    description: '사용자가 기억해야 할 것을 최소화하고 선택 가능한 옵션을 눈에 보이게 제시하는지 평가합니다. 드롭다운, 버튼, 메뉴 등으로 옵션을 명시적으로 보여줘야 합니다.',
    why_important: '사용자는 복잡한 명령어나 절차를 기억하기 어려워합니다. 보고 선택할 수 있으면 훨씬 쉽습니다.',
    evaluation_criteria: '명령어 입력 대신 버튼/메뉴 제공, 이전 입력 기록 표시, 자동완성 제공 등을 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N6_3_memory_load: {
    name: '인식 단서',
    description: '아이콘, 색상, 레이블 등 사용자가 기능을 쉽게 인식할 수 있는 시각적 단서가 제공되는지 평가합니다.',
    why_important: '적절한 시각적 단서는 사용자의 인지 부담을 줄이고 빠른 의사결정을 돕습니다.',
    evaluation_criteria: '아이콘의 적절성, 색상 코딩, 명확한 레이블, 툴팁 등을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N7_1_accelerators: {
    name: '기억 부담',
    description: '사용자가 여러 단계를 거치면서 이전 정보를 기억해야 하는 부담이 최소화되어 있는지 평가합니다. 진행 단계 표시, 입력한 정보 요약 등이 필요합니다.',
    why_important: '복잡한 프로세스에서 이전 정보를 기억해야 한다면 사용자는 쉽게 혼란스러워집니다.',
    evaluation_criteria: '다단계 폼에서 진행 상황과 입력 정보가 계속 보이는지 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N7_2_personalization: {
    name: '단축키 지원',
    description: '키보드 단축키, 접근성 가속기, skip navigation 등 숙련 사용자를 위한 빠른 접근 수단이 제공되는지 평가합니다.',
    why_important: '반복 사용자에게는 효율적인 작업 수단이 필수적입니다. 단축키는 생산성을 크게 향상시킵니다.',
    evaluation_criteria: 'accesskey 속성, skip to content 링크, 주요 기능의 단축키 존재 여부를 확인',
    accuracy: '95% 정확도',
    category: '편의성'
  },
  N7_3_batch_operations: {
    name: '개인화',
    description: '사용자가 자신의 선호에 맞게 인터페이스를 조정할 수 있는 기능이 있는지 평가합니다. 글꼴 크기 조절, 색상 테마 선택 등이 해당됩니다.',
    why_important: '사용자마다 선호와 필요가 다릅니다. 개인화 옵션은 만족도를 높입니다.',
    evaluation_criteria: '글꼴 크기 조절, 다크모드, 레이아웃 변경, 언어 선택 등의 개인화 옵션을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N8_1_highlight_essential: {
    name: '일괄 작업',
    description: '여러 항목을 한 번에 선택하여 일괄 처리할 수 있는 기능이 제공되는지 평가합니다. 체크박스로 다중 선택 후 삭제, 이동 등이 가능해야 합니다.',
    why_important: '항목을 하나씩 처리하는 것은 비효율적입니다. 일괄 작업은 시간을 크게 절약합니다.',
    evaluation_criteria: '리스트에서 전체 선택, 다중 선택, 일괄 삭제/이동/수정 기능 존재 여부를 확인',
    accuracy: '95% 정확도',
    category: '편의성'
  },
  N8_2_clean_interface: {
    name: '필수 정보 강조',
    description: '불필요한 정보를 제거하고 정말 중요한 정보만 강조하여 보여주는지 평가합니다. 복잡하고 혼잡한 화면은 피해야 합니다.',
    why_important: '정보 과부하는 사용자의 인지 능력을 저하시키고 중요한 것을 놓치게 만듭니다.',
    evaluation_criteria: '한 화면에 표시되는 정보량, 시각적 계층 구조, 불필요한 요소 제거 정도를 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N8_3_visual_hierarchy: {
    name: '깔끔한 인터페이스',
    description: '여백, 정렬, 그룹핑 등을 통해 시각적으로 깔끔하고 정돈된 인터페이스를 제공하는지 평가합니다.',
    why_important: '복잡하고 어지러운 UI는 사용자에게 스트레스를 주고 집중을 방해합니다.',
    evaluation_criteria: '여백 활용, 요소 정렬, 그룹핑, 시각적 균형을 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N9_1_error_messages: {
    name: '시각적 계층',
    description: '크기, 색상, 위치 등을 통해 정보의 중요도와 우선순위가 명확히 구분되는지 평가합니다.',
    why_important: '명확한 시각적 계층은 사용자가 정보를 빠르게 스캔하고 중요한 것을 먼저 파악하게 합니다.',
    evaluation_criteria: ' 제목/본문 크기 차이, 색상 대비, 배치 위치의 적절성을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N9_2_recovery_support: {
    name: '오류 메시지 품질',
    description: '오류 발생 시 사용자가 이해할 수 있는 명확한 메시지를 제공하는지 평가합니다. "Error 404" 같은 기술적 메시지가 아니라 "페이지를 찾을 수 없습니다" 같은 친절한 설명이 필요합니다.',
    why_important: '불친절한 오류 메시지는 사용자를 좌절시키고 문제 해결을 어렵게 만듭니다.',
    evaluation_criteria: '오류 메시지의 명확성, 친절함, 해결 방법 제시 여부를 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N10_1_help_and_support: {
    name: '도움말 및 지원',
    description: '사용자가 필요할 때 도움말과 문서를 쉽게 찾고 활용할 수 있는지 평가합니다. FAQ, 튜토리얼, 사용 가이드, 고객 지원 등이 제공되어야 합니다.',
    why_important: '도움말이 없거나 찾기 어려우면 사용자는 문제 해결에 실패하고 이탈하게 됩니다.',
    evaluation_criteria: '도움말 접근성, 검색 가능성, 내용의 명확성, 지원 채널 다양성을 확인합니다. 5점: 다양한 지원 수단과 명확한 문서 제공, 3점: 기본적인 도움말만 제공, 1점: 도움말 없음',
    accuracy: '80%',
    category: '편의성'
  },
  N11_2_search_quality: {
    name: '문서화',
    description: 'FAQ, 매뉴얼, 튜토리얼 등 충분한 문서와 가이드가 제공되는지 평가합니다.',
    why_important: '복잡한 기능일수록 상세한 설명이 필요합니다. 좋은 문서는 지원 비용을 줄입니다.',
    evaluation_criteria: 'FAQ, 사용 가이드, 튜토리얼, 동영상 설명 등의 존재와 품질을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N12_1_responsive_layout: {
    name: '검색 자동완성',
    description: '검색어 입력 시 자동완성, 추천 검색어, 최근 검색어 등이 제공되는지 평가합니다.',
    why_important: '자동완성은 입력 시간을 줄이고 오타를 방지하며 관련 검색어를 제안합니다.',
    evaluation_criteria: '검색 입력 시 자동완성 드롭다운, 인기 검색어, 최근 검색어 표시 여부를 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N12_2_touch_optimization: {
    name: '검색 품질',
    description: '검색 결과의 정확도와 관련성이 높은지 평가합니다. 유사어 인식, 필터링, 정렬 옵션 등이 제공되어야 합니다.',
    why_important: '부정확한 검색 결과는 사용자가 원하는 정보를 찾지 못하게 만듭니다.',
    evaluation_criteria: '검색 결과의 정확성, 필터/정렬 옵션, 검색 결과 없을 때의 대안 제시를 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N13_content_freshness: {
    name: '반응형 레이아웃',
    description: '다양한 화면 크기(모바일, 태블릿, 데스크톱)에서 적절히 조정되는 레이아웃을 제공하는지 평가합니다.',
    why_important: '모바일 사용자가 증가하면서 반응형 디자인은 필수가 되었습니다.',
    evaluation_criteria: 'viewport meta 태그, 미디어 쿼리, flexible grid 사용 여부를 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N14_1_color_contrast: {
    name: '터치 최적화',
    description: '모바일 터치 인터페이스에 적합한 크기와 간격으로 UI 요소가 배치되어 있는지 평가합니다. 버튼은 최소 44x44px 이상이어야 합니다.',
    why_important: '작은 버튼은 터치하기 어렵고 오조작을 유발합니다.',
    evaluation_criteria: '터치 타겟 크기, 요소 간 간격, 터치 제스처 지원 여부를 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N14_2_keyboard_accessibility: {
    name: '콘텐츠 신선도',
    description: '콘텐츠가 최신 상태로 유지되고 있는지, 업데이트 날짜가 표시되는지 평가합니다.',
    why_important: '오래된 정보는 신뢰도를 떨어뜨리고 잘못된 의사결정을 유도할 수 있습니다.',
    evaluation_criteria: '최근 업데이트 날짜 표시, 게시 날짜, 뉴스/공지사항의 최신성을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N15_file_download: {
    name: '색상 대비',
    description: '텍스트와 배경의 색상 대비가 충분하여 가독성이 높은지 평가합니다. WCAG AA 기준(4.5:1 이상)을 따라야 합니다.',
    why_important: '낮은 대비는 시각 장애인뿐 아니라 일반 사용자에게도 읽기 어렵게 만듭니다.',
    evaluation_criteria: '텍스트와 배경의 명도 대비 비율을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N16_form_complexity: {
    name: '키보드 접근성',
    description: '마우스 없이 키보드만으로 모든 기능을 사용할 수 있는지 평가합니다. Tab 키로 이동, Enter로 실행 등이 가능해야 합니다.',
    why_important: '운동 장애인이나 키보드 선호 사용자를 위해 필수적입니다.',
    evaluation_criteria: 'Tab 순서, focus 스타일, 키보드 트랩 여부를 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N17_1_lcp_performance: {
    name: '파일 다운로드',
    description: '다운로드 링크가 명확하고, 파일 형식과 크기 정보가 제공되는지 평가합니다.',
    why_important: '사용자는 다운로드 전에 파일 정보를 알아야 합니다. 예상치 못한 대용량 다운로드는 불편을 초래합니다.',
    evaluation_criteria: '다운로드 링크의 명확성, 파일 형식 표시, 파일 크기 표시 여부를 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N17_2_fid_responsiveness: {
    name: '폼 복잡도',
    description: '입력 폼이 간결하고 이해하기 쉬운지, 불필요한 필드가 없는지 평가합니다.',
    why_important: '복잡한 폼은 완료율을 크게 낮춥니다. 필수 정보만 요구하는 것이 중요합니다.',
    evaluation_criteria: '입력 필드 수, 필수/선택 표시, 그룹핑, 도움말 제공 여부를 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N17_3_cls_stability: {
    name: 'LCP 성능',
    description: 'Largest Contentful Paint - 페이지의 가장 큰 콘텐츠가 로드되는 시간을 측정합니다. 2.5초 이내가 좋습니다.',
    why_important: '느린 로딩은 사용자 이탈의 주요 원인입니다. LCP는 실제 콘텐츠를 볼 수 있는 시점을 나타냅니다.',
    evaluation_criteria: ' LCP 시간을 측정',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N17_4_tti_interactive: {
    name: 'FID 응답성',
    description: 'First Input Delay - 사용자가 처음 상호작용(클릭, 탭)할 때까지의 지연 시간을 측정합니다. 100ms 이내가 좋습니다.',
    why_important: '반응이 느리면 사용자는 사이트가 멈춘 것으로 오해하고 좌절합니다.',
    evaluation_criteria: 'FID 시간을 측정',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N18_multilingual: {
    name: 'CLS 안정성',
    description: ' Cumulative Layout Shift - 페이지 로딩 중 레이아웃이 얼마나 많이 흔들리는지 측정합니다. 0.1 이하가 좋습니다.',
    why_important: '예상치 못한 레이아웃 변화는 사용자가 잘못된 버튼을 클릭하게 만들고 짜증을 유발합니다.',
    evaluation_criteria: 'CLS 점수를 측정',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N19_notification: {
    name: 'TTI 상호작용',
    description: 'Time to Interactive - 페이지가 완전히 상호작용 가능한 상태가 되는 시간을 측정합니다. 3.8초 이내가 좋습니다.',
    why_important: ' 페이지가 보여도 실제로 사용할 수 없다면 의미가 없습니다.',
    evaluation_criteria: 'TTI 시간을 측정',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N20_branding: {
    name: '다국어 지원',
    description: '여러 언어를 지원하거나 언어 전환 기능이 제공되는지 평가합니다.',
    why_important: ' 글로벌 서비스를 위해서는 다국어 지원이 필수입니다.',
    evaluation_criteria: '언어 선택 옵션, 번역 품질, lang 속성 설정을 확인',
    accuracy: '75% 정확도',
    category: '디자인'
  },
  N21_link_validity: {
    name: '알림 기능',
    description: '중요한 정보를 사용자에게 적시에 알려주는 알림 기능이 있는지 평가합니다.',
    why_important: '적절한 알림은 사용자 참여도를 높이고 중요한 정보를 놓치지 않게 합니다.',
    evaluation_criteria: '푸시 알림, 이메일 알림, 인앱 알림 등의 존재와 관리 옵션을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N22_image_accessibility: {
    name: '브랜딩',
    description: '일관된 브랜드 아이덴티티(로고, 색상, 톤앤매너)가 사이트 전체에 적용되어 있는지 평가합니다.',
    why_important: '강한 브랜드 아이덴티티는 신뢰감과 인지도를 높입니다.',
    evaluation_criteria: '로고 배치, 브랜드 색상 사용, 일관된 메시지 톤을 확인',
    accuracy: '75% 정확도',
    category: '편의성'
  },
  N21_link_validity: {
    name: '링크 유효성',
    description: '웹사이트 내 모든 링크가 유효하고 올바르게 작동하는지 평가합니다. HTTP 상태 코드를 확인하여 404 에러, 500 에러 등이 없는지 검증합니다.',
    why_important: '깨진 링크(404 에러)는 사용자 경험을 크게 저해하고 웹사이트의 신뢰도를 떨어뜨립니다.',
    evaluation_criteria: 'HTTP 상태 코드를 확인합니다. 5점: 모든 링크 정상(200), 3점: 일부 리디렉션(3xx), 1점: 깨진 링크 존재(4xx, 5xx)',
    accuracy: '98%',
    category: '편의성'
  },
  N22_image_accessibility: {
    name: '이미지 접근성',
    description: '모든 이미지에 대체 텍스트(alt 속성)가 제공되는지 평가합니다. 시각 장애인이나 이미지 로딩 실패 시에도 내용을 이해할 수 있어야 합니다.',
    why_important: 'alt 텍스트가 없으면 시각 장애인은 화면 리더로 이미지 내용을 이해할 수 없고, 접근성 법규를 위반하게 됩니다.',
    evaluation_criteria: 'img 태그의 alt 속성 존재 여부를 확인합니다. 5점: 모든 이미지에 의미있는 alt 텍스트, 3점: 일부만 제공 또는 빈 alt, 1점: alt 없음',
    accuracy: '95%',
    category: '편의성'
  },
  N23_https_security: {
    name: 'HTTPS 보안',
    description: '웹사이트가 HTTPS 프로토콜을 사용하여 암호화된 보안 연결을 제공하는지 평가합니다. SSL/TLS 인증서가 적용되어 있어야 합니다.',
    why_important: 'HTTP는 데이터가 암호화되지 않아 개인정보 유출, 중간자 공격 등의 보안 위협에 노출됩니다. 또한 검색 엔진 순위에도 부정적 영향을 미칩니다.',
    evaluation_criteria: 'URL 프로토콜과 SSL 인증서를 확인합니다. 5점: HTTPS 적용 및 유효한 인증서, 3점: HTTPS이지만 경고 있음, 1점: HTTP 사용',
    accuracy: '100%',
    category: '편의성'
  },
};

/**
 * 항목 상세 정보를 가져오는 함수
 */
export function getItemDetails(itemId) {
  return ITEM_DETAILS[itemId] || {
    name: itemId,
    description: '항목 설명 없음',
    why_important: '중요도 설명 없음',
    evaluation_criteria: '평가 기준 없음',
    accuracy: '정확도 미측정',
    category: '편의성'
  };
}

/**
 * 디자인 항목 목록 (9개)
 */
export const DESIGN_ITEMS = [
  'N12_1_responsive_layout',
  'N12_2_touch_optimization',
  'N14_1_color_contrast',
  'N20_branding',
  'N4_1_visual_consistency',
  'N4_3_standard_compliance',
  'N6_2_recognition_cues',
  'N8_2_clean_interface',
  'N8_3_visual_hierarchy',
];

/**
 * 항목이 디자인 카테고리인지 확인
 */
export function isDesignItem(itemId) {
  return DESIGN_ITEMS.includes(itemId);
}
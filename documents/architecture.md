# My Little Forest - 아키텍처 설계 문서

## 1. 개요

이 문서는 "나의 작은 숲" 웹 서비스의 기술 아키텍처와 설계 결정 사항을 기록합니다.

### 1.1 프로젝트 특성

- **토이 프로젝트**: 빠른 프로토타이핑과 학습 목적
- **단일 사용자**: 인증 없이 브라우저별 독립 세션
- **점진적 확장 가능**: 나중에 백엔드(Supabase) 추가 가능한 구조

---

## 2. 기술 스택 선택

| 영역 | 선택 | 대안 | 선택 이유 |
|------|------|------|----------|
| **프레임워크** | Next.js 15 (App Router) | React + Vite | SSR 지원, 향후 API Routes 활용 가능 |
| **스타일링** | Tailwind CSS | styled-components | 빠른 프로토타이핑, 번들 크기 최적화 |
| **상태관리** | Zustand | Redux, Context | 최소 보일러플레이트, persist 미들웨어 내장 |
| **데이터 저장** | LocalStorage | IndexedDB | 단순한 데이터 구조에 적합 |
| **언어** | TypeScript | JavaScript | 타입 안정성, 리팩토링 용이 |

---

## 3. 상태 관리 설계

### 3.1 Zustand 선택 이유

**비교 분석:**

| 기준 | Zustand | Redux Toolkit | React Context |
|------|---------|---------------|---------------|
| 보일러플레이트 | 최소 | 중간 | 최소 |
| 학습 곡선 | 낮음 | 중간 | 낮음 |
| DevTools | 지원 | 지원 | 제한적 |
| Persist | 미들웨어 내장 | 별도 설정 | 직접 구현 |
| 리렌더링 최적화 | selector 기반 | selector 기반 | 어려움 |
| 번들 크기 | ~2KB | ~10KB+ | 0 |

**결론**: 토이 프로젝트에서 Zustand는 최소한의 코드로 필요한 기능을 제공합니다.

### 3.2 스토어 분리 전략

```
┌─────────────────┐     ┌──────────────────┐
│   gameStore     │     │  cooldownStore   │
├─────────────────┤     ├──────────────────┤
│ - trees[]       │     │ - water          │
│ - seeds[]       │     │ - fertilizer     │
│ - totalPoints   │     │ - seed_ad        │
│ - tutorial      │     └──────────────────┘
│ - stats         │
└─────────────────┘
```

**분리 이유:**
1. **관심사 분리**: 게임 데이터와 시간 기반 로직 분리
2. **리렌더링 최적화**: 쿨다운 타이머가 게임 상태 컴포넌트에 영향 주지 않음
3. **테스트 용이성**: 각 스토어 독립적으로 테스트 가능

---

## 4. 데이터 레이어 추상화

### 4.1 패턴 선택: Custom Hook + Adapter

**Repository Pattern vs Custom Hook + Adapter:**

| 기준 | Repository Pattern | Custom Hook + Adapter |
|------|-------------------|----------------------|
| 복잡도 | 높음 (인터페이스, 구현체, DI 컨테이너) | 낮음 |
| React 통합 | 별도 레이어 필요 | 자연스러운 통합 |
| 토이 프로젝트 적합성 | 오버엔지니어링 | 적절함 |
| 확장성 | 매우 높음 | 충분함 |

**결론**: 토이 프로젝트에서는 Custom Hook + Adapter 패턴이 적합합니다. 필요시 Repository 패턴으로 발전 가능합니다.

### 4.2 Storage Adapter 인터페이스

```typescript
interface StorageAdapter {
  load(): Promise<GameState | null>;
  save(state: GameState): Promise<void>;
  patch<K extends keyof GameState>(key: K, value: GameState[K]): Promise<void>;
  clear(): Promise<void>;
}
```

**설계 원칙:**
- **의존성 역전**: 상위 모듈(Hooks)이 하위 모듈(LocalStorage)에 의존하지 않음
- **교체 용이성**: Supabase, IndexedDB 등으로 쉽게 교체 가능
- **테스트 용이성**: Mock Adapter 주입 가능

### 4.3 백엔드 전환 전략

```
현재: Client → Zustand → LocalStorage
향후: Client → Zustand → API Routes → Supabase
```

**전환 시 변경 사항:**
1. `StorageAdapter` 구현체만 교체
2. Zustand persist의 storage 옵션 변경
3. 기존 컴포넌트 코드 변경 없음

---

## 5. 컴포넌트 구조

### 5.1 디렉토리 구조

```
src/
├── components/
│   ├── game/          # 게임 핵심 컴포넌트
│   ├── inventory/     # 인벤토리 관련
│   ├── ads/           # 광고 (Mock)
│   ├── tutorial/      # 튜토리얼
│   └── ui/            # 재사용 UI 컴포넌트
├── hooks/             # 커스텀 훅
├── stores/            # Zustand 스토어
├── types/             # TypeScript 타입
├── lib/               # 유틸리티, 상수
└── providers/         # Context Providers
```

### 5.2 컴포넌트 계층

```
App (layout.tsx)
└── GameProvider
    └── Page (page.tsx)
        ├── ForestGrid
        │   └── Tile (x25)
        │       └── Tree
        ├── ActionPanel
        │   ├── WaterButton
        │   └── FertilizeButton
        ├── SeedInventory
        │   └── SeedCard
        ├── MockAdButton
        └── TutorialOverlay
```

---

## 6. 게임 상수 설계

### 6.1 티어별 성장 스텝

| 티어 | 스텝 | 설계 근거 |
|------|------|----------|
| Common | 2 | 최소 2일 (튜토리얼 체험용) |
| Uncommon | 3 | 물주기 + 비료 1회 |
| Rare | 4 | 적극적 광고 시청 유도 |
| Epic | 5 | 중급 유저 목표 |
| Legendary | 6 | 고급 유저 도전 과제 |
| Mythic | 8 | 이벤트성 최상위 |

### 6.2 쿨다운 시간

| 액션 | 쿨다운 | 설계 근거 |
|------|--------|----------|
| 물주기 | 24시간 | 일일 1회 방문 유도 |
| 비료 | 20분 | 세션 내 반복 시청 유도, 피로도 관리 |
| 씨앗 광고 | 3시간 | 빈 손 구제, 남용 방지 |

---

## 7. 그리드 설계

### 7.1 5x5 그리드 선택 이유

| 크기 | 타일 수 | 장점 | 단점 |
|------|---------|------|------|
| 3x3 | 9 | 모바일 최적화 | 전략성 부족 |
| 4x4 | 16 | 균형 | 어중간함 |
| **5x5** | **25** | **충분한 공간, 다양한 전략** | **화면 공간 필요** |
| 6x6 | 36 | 많은 콘텐츠 | 복잡함, 관리 어려움 |

**결론**: 5x5는 MVP에 적합한 크기로, 다양한 티어의 나무를 배치하고 전략적 선택이 가능합니다.

### 7.2 좌표 시스템

```
(0,0) (1,0) (2,0) (3,0) (4,0)
(0,1) (1,1) (2,1) (3,1) (4,1)
(0,2) (1,2) (2,2) (3,2) (4,2)   ← 튜토리얼 시작 위치: (2,2)
(0,3) (1,3) (2,3) (3,3) (4,3)
(0,4) (1,4) (2,4) (3,4) (4,4)
```

---

## 8. 향후 확장 계획

### Phase 1 (현재): MVP
- LocalStorage 기반 저장
- 기본 게임 루프 완성
- Mock 광고 시스템

### Phase 2: 백엔드 추가
- Supabase 연동
- 사용자 인증
- 서버 사이드 검증 (어뷰징 방지)

### Phase 3: 소셜 기능
- 주간 랭킹
- 나무 도감
- 시즌 이벤트

---

## 9. 결론

이 설계는 **"단순하게 시작하고, 필요할 때 확장한다"** 원칙을 따릅니다.

- Zustand + LocalStorage로 빠르게 프로토타입 완성
- StorageAdapter 추상화로 백엔드 전환 준비
- 컴포넌트 분리로 유지보수성 확보

토이 프로젝트의 특성상 완벽한 설계보다 **빠른 구현과 피드백**에 집중합니다.

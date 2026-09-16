# 스펙 변경 사항 — Promotion List: 리스트 뷰 · 캘린더 뷰

- 영향 화면: **Promotion List** (`/promotion/promotion-list`)
- 영향 영역: 검색 조건 `Channel` 필터, 조회 범위, 검색 결과 영역(`List View` / `Calendar View`), 리스트 `End Date` 컬럼, Promotion 수정 화면(V2)의 `Always on` · `Promotion Type` 복원
- 신규 메뉴/라우트 없음
- 이 문서는 Promotion List 에 적용된 변경을 **최종 상태 기준으로 한 번에** 정리한 것입니다.

## 2. 공통 — 보기 방식 전환 (View Mode)

### 2-1. 위치 및 구성

- 결과 영역 상단, `N results` 텍스트 바로 오른쪽에 아이콘 + 라벨 토글 버튼 그룹을 배치합니다.
- 우측의 `Updated at` · `Refresh` · `Export` 는 기존과 동일합니다.

| 값 | 라벨 | 아이콘 | 설명 |
| --- | --- | --- | --- |
| `list` | `List View` | 목록(ViewList) | 기존 DataGrid 리스트 (**기본값**) |
| `calendar` | `Calendar View` | 달력(CalendarMonth) | 월 단위 캘린더 |

### 2-2. 동작 규칙

- 토글 전환은 **화면 상태만 변경**하며 재조회하지 않습니다. 두 뷰는 같은 검색 결과(필터된 목록)를 공유합니다.
- `Search` / `Reset` 을 실행해도 현재 선택된 보기 방식은 유지됩니다.
- `Export` 는 보기 방식과 무관하게 **현재 검색 결과 전체**를 내려받습니다(기존 동작).
- `N results` 는 두 뷰 모두 검색 결과 건수를 표시합니다(캘린더에서 이번 달에 보이는 건수가 아님).
- 리스트의 페이지네이션은 `List View` 에서만 노출됩니다.
- `Calendar View` 에서 `List View` 로 갔다가 돌아오면 캘린더 상태(표시 월 · Always-on 옵션 · 선택 항목)는 초기화됩니다.

---

### 3-3. 조회 범위

- 조회 대상은 **선택한 Brand & Corp 조합에 속한 프로모션**(행의 `Brand` + `Corp`)으로 한정합니다. 조합에 속하지 않는 프로모션은 `Channel = All` 이어도 나오지 않습니다.
- Brand & Corp 선택이 바뀌면 **현재 검색 조건 그대로 자동 재조회**하며, `List View` / `Calendar View` 모두 동일하게 반영됩니다.
- 메뉴 진입 직후 목록도 기본 검색 조건(Status = Active, Period = 오늘 기준 ±3개월)을 모두 적용한 결과입니다. `Search` 버튼을 눌렀을 때와 동일합니다.
- `Reset` 은 검색 조건을 기본값으로 되돌리고 현재 Brand & Corp 범위 안에서 기본 목록을 보여줍니다.

### 3-4. 검색 조건과 상시(Always-on) 프로모션

| 조건 | 동작 |
| --- | --- |
| `Date Type = Start Date` | 상시 프로모션도 `Start Date` 로 동일하게 기간 필터 적용 |
| `Date Type = End Date` | 상시 프로모션은 종료일이 없으므로 **기간 필터에서 제외하지 않고 항상 포함** |
| `Status` / `Channel` / `Search` | 일반 프로모션과 동일하게 적용 |

---

## 4. List View 변경

### 4-1. `End Date` 컬럼

| 조건 | 표시 |
| --- | --- |
| `alwaysOn = true` | 아웃라인 칩 **`Always-on`** |
| 일반 | 기존과 동일한 일시 문자열 |
| 값 없음(비상시) | `-` |

---

## 5. Calendar View


### 5-1. 헤더 (월 이동 · Today · Always-on 필터)

| 요소 | 동작 |
| --- | --- |
| `‹` / `›` | 이전 달 / 다음 달로 이동 |
| 월 표기 | `MMMM YYYY` 형식 (예: `September 2026`) |
| `Today` | 상단 헤더 `Timezone` 기준 **오늘이 속한 달**로 이동 |
| Always-on 토글 | 아래 표 참조. `Today` 바로 오른쪽에 붙여 배치 |

- 캘린더 최초 진입 시 표시 월은 `Timezone` 기준 **현재 달**입니다.
- 월 이동은 표시만 바꾸며 재조회하지 않습니다. 검색 `Period` 밖의 달로 이동하면 해당 달에는 바가 없을 수 있습니다.
- **채널 범례/채널 토글은 두지 않습니다.** 채널 필터는 검색 조건의 `Channel` 셀렉트로만 수행합니다.

### Always-on 토글

캘린더 헤더의 `Today` 오른쪽 3단 토글로, **캘린더 안에서만** 동작하며 검색 결과 자체나 `N results` 에는 영향을 주지 않습니다.

| 라벨 | Always-on 스트립 | 기간 바 |
| --- | --- | --- |
| `Include Always-on` (**기본값**) | 표시 | 표시 |
| `Exclude Always-on` | **숨김** | 표시 |
| `Always-on Only` | 표시 | **숨김** (그리드는 날짜만 남음) |

- 선택 상태는 월을 이동해도 유지됩니다.

### 5-3. Always-on 스트립

- 캘린더 그리드 바로 위에 연한 배경의 한 줄 영역으로 노출합니다.
- 좌측에 `Always-on N` (N = 현재 검색 결과 중 상시 프로모션 수), 이어서 상시 프로모션을 **칩**으로 나열합니다.
- 칩 구성: 5-2 와 동일 (`상태 태그 + Title · 채널 코드`). **맨 앞에 채널 색상 점은 두지 않습니다.**
- `Draft` 상태 칩은 **점선 테두리**로 표시합니다.
- 칩 클릭 시 하단 상세 패널(5-5)을 엽니다. 선택된 칩은 채널 색상 테두리로 강조합니다.
- 상시 프로모션이 0건이면 `No always-on promotions in the current result.` 문구를 표시합니다.
- 상시 프로모션은 종료일이 없으므로 **월 그리드에는 바로 그리지 않고 이 스트립에만 표시**합니다(월을 이동해도 스트립 내용은 동일).

### 5-2. 캘린더 항목 표시 정보

- 기간 바와 Always-on 칩 모두 **상태 · 제목 · 채널** 3가지만 표시합니다.
- 노출 대상: 검색 결과 중 상시가 아니고 `Start Date` · `End Date` 가 모두 있는 프로모션

| 요소 | 규칙 |
| --- | --- |
| 상태 태그 | 상태명을 **대문자 텍스트 pill** 로 표시. 토글 스위치·아이콘 등 그래픽은 사용하지 않음 |
| Title | 프로모션 제목. 폭이 부족하면 말줄임(…) |
| 채널 코드 | `· GM_Official_KR` 형식으로 Title 뒤에 흐리게 표기 |


#### **채널 색상** (바 배경 `soft` / 글자·라인 `main`) — 채널명은 3-1 매핑 기준, 기준 채널은 프로모션의 첫 번째 Trigger Channel

| 채널 | main | soft |
| --- | --- | --- |
| `GM_Official_KR` | `#2F5FBF` | `#DFE7F7` |
| `GM_Official_INT` | `#0F6E63` | `#DDEFEB` |
| `GM_KAKAO_KR` | `#B7791F` | `#F6EBD2` |
| `GM_SSG_KR` | `#B3402F` | `#F6E0DC` |
| `GM_SSF_KR` | `#1E8E4C` | `#DCEFE3` |
| `GM_SI_VILLAGE_KR` | `#7A4FBF` | `#EAE2F7` |
| `GM_ONLINE_FARFETCH` | `#C2185B` | `#FCE4EC` |
| `GM_Official_CA` | `#00838F` | `#E0F7FA` |
| `GM_Official_US` | `#3949AB` | `#E8EAF6` |
| `GM_Official_AU` | `#E65100` | `#FFE0B2` |
| `GM_Official_JP` | `#AD1457` | `#FCE4EC` |
| `ATS_Official_KR` | `#5D4037` | `#EFEBE9` |
| `NUF_Official_KR` | `#2E7D32` | `#E8F5E9` |
| 그 외 | `#546E7A` | `#ECEFF1` |

### 5-5. 상세 패널 (프로모션 클릭 시 하단)

바 또는 상시 칩을 클릭하면 캘린더 아래에 패널이 열립니다. 하나만 열리며, 다른 항목을 클릭하면 교체됩니다.
노출 항목은 아래 5개로 한정합니다. **ID · Target · Reward 수량(total/sold/alert)은 노출하지 않습니다.**

| 항목 | 내용 |
| --- | --- |
| 제목 | 채널 색상 점 + Title |
| `Channel` | Trigger Channels (쉼표 구분) |
| `Status` | Status 칩 — 리스트 `Status` 컬럼과 동일한 색상 규칙 |
| `Period` | 일반: `MM/DD HH:mm → MM/DD HH:mm` / 상시: `MM/DD HH:mm ~ Always-on` |
| `Promotion Type` | `GWP · Free Gift` 또는 `Packaging Benefit` — 등록 화면의 Promotion Type 과 동일 표기 |
| `Reward` | `제품명 - SKU` 를 쉼표로 나열 |
| `Open Promotion` | 수정 화면(`/promotion/promotion-list/edit-v2/{id}`)으로 이동 |
| `✕` | 패널 닫기 |

- 검색을 다시 실행해 결과가 바뀌면 선택은 해제되고 패널이 닫힙니다.
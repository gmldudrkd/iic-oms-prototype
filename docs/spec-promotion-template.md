# 스펙 변경 사항 — Promotion Template(템플릿) 메뉴 추가 및 멀티 등록

- 영향 화면: **Promotion › Template** (신규, `/promotion/template`), **Promotion 등록/수정 화면** (`/promotion/promotion-list/add-v2`, `/promotion/promotion-list/edit-v2/:id`), **Promotion List** (멀티 등록 결과가 Draft 로 추가됨)
- 신규 메뉴/라우트: Promotion 메뉴 하위 **`Template`** (기존 `List` 아래)
- 기준 문서: GWP 멀티 등록 프로토타입(템플릿 탭), 9월 GWP 시트(탬버린즈, gid 904858322)
- 문서 기준일: 2026-09-15 (프로토타입 최종 반영 상태 기준)

---

## 1. 변경 개요

프로모션을 만들 때마다 Basic Info · Target · Reward 를 반복 입력하지 않도록, 이 세 영역을 **템플릿**으로 저장해 두고 재사용하는 기능을 추가합니다.
템플릿에서 채널을 여러 개 고르고 채널별 기간만 입력하면 **채널 수만큼 프로모션이 Draft 로 한 번에 생성**됩니다(멀티 등록).

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 프로모션 생성 | 등록 화면에서 건별 입력 | 템플릿에서 **채널별 멀티 등록** 또는 등록 화면에서 **템플릿 불러오기** |
| 반복 조건 관리 | 없음 | **Promotion › Template** 메뉴에서 카드 형태로 관리 (등록·편집·삭제) |
| 등록 화면 ↔ 템플릿 | 없음 | `Load Template`(불러오기) / `Save as Template`(현재 입력값을 템플릿으로 저장) |
| 멀티 등록 결과 | 없음 | 채널 1개 = 프로모션 1건, **모두 Draft** 로 Promotion List 에 추가 |

---

## 2. Promotion › Template 메뉴 (템플릿 목록)

### 2-1. 화면 구성


| 요소 | 설명 |
| --- | --- |
| 검색 폼 | Promotion List 검색 폼과 동일한 영역·동작(`Search` 클릭 시 적용, `Reset` 초기화)이며 필드는 **`Promotion Type` · `Search`** 2개  |
| `N results` | 검색 결과 건수. Promotion List 와 동일 표기로 결과 영역 좌측 상단에 표시 |
| 카드 본문 | 노출 항목 3개만 표시. `Promotion Type` — 배지(GWP 파랑 / Packaging 주황) · `Target Type` — 배지(`Specific Product` / `Order Amount` / `All Products`) · `Reward` — Option Select 템플릿이면 보라색 `Option Select` 배지를 먼저 표시하고, 이어서 제품명 + SAP 코드를 한 줄씩 |
| 카드 하단 | 우측 삭제 아이콘 · `Edit` · `Multi Register` |
| `+ New Template` | 상단 버튼과 점선 카드 모두 신규 등록 팝업 노출 |

#### 2-1-1. 검색 필드

| 필드 | 옵션 | 동작 |
| --- | --- | --- |
| `Promotion Type` | `All`(기본) / `GWP · Free Gift` / `Packaging Benefit` | 선택한 타입의 템플릿만 조회 |
| `Search` | 키: `Title` / `GWP Name` / `Reward SAP Code` / `Target Product Name` / `Target SAP Code` | 줄바꿈으로 여러 키워드 입력 가능(엑셀 붙여넣기 시 탭·줄바꿈 자동 변환) |

- 템플릿에서 **무엇을 등록했는지는 추적하지 않습니다.** 카드에 등록 건수·채널 표시를 두지 않습니다.
- 목록 정렬: 최근 생성 순(신규 저장 시 맨 앞에 추가).

### 2-2. 템플릿 등록 / 편집 팝업

- **화면 중앙 모달**로 표시합니다.
    - 해더정보
        - 등록 시 : `New Template · Create Template`
        - 수정 시 : `Edit Template · {이름}`.
- 3개 섹션으로 구성하며 각 항목은 프로모션 등록 화면의 동일 항목과 같은 의미입니다.

> Period · Channel · Status 는 채널마다 달라지므로 템플릿에 두지 않고, 멀티 등록 단계에서 채널별로 입력합니다. Reward 수량은 생성된 각 프로모션에서 입력합니다.

| 섹션 | 항목 | 규칙 |
| --- | --- | --- |
| 1. Basic Info | Template Name | 필수. **같은 이름으로 여러 템플릿 저장 가능**(중복 등록 허용, 입력란 아래 안내) |
|  | Promotion Type | `GWP · Free Gift` / `Packaging Benefit` |
|  | Promotion Goal | Create Promotion 과 동일한 선택지(`Increase Sales` / `Acquire New Customers` / `Drive Repurchase` / `Promote New Products` / `Clear Inventory` / `Boost Brand Awareness`) + `Custom`(직접 입력, 필수) |
| 2. Target | 모드 | `Specific Product` / `Order Amount` / `All Products` |
|  | Target Purchase Basis | Specific Product 일 때 `Any` / `All` |
|  | 대상 제품 | Specific Product 일 때 1개 이상 필수. 상품 검색(SAP Code / Product Name / Model Code, 줄바꿈 복수 키워드). `+ Select all (N)` 으로 검색 결과 일괄 추가, `Remove all (N)` 으로 선택 제품 일괄 제거 |
|  | Minimum Order Amount | Order Amount 일 때 0 초과 필수 (KRW) |
|  | Purchase Quantity | 1~99 |
|  | Reward Basis | `Per order` / `Per product quantity`(선택 시 `Reward per unit` 입력 노출) |
| 3. Reward · Benefit | Reward Type | `Default Gift` / `Option Select`. Promotion Type 과 무관하게 선택 가능(프로모션 등록 화면과 동일). Option Select 는 자사몰(Official) 채널 전용 |
|  | Reward 제품 | 1개 이상 필수. GWP 는 GWP·Packaging 카테고리, Packaging Benefit 은 Packaging 카테고리만 검색. `Select all` / `Remove all` 동일 제공 |

- 하단 버튼: `Cancel` · `Save`. 필수값(Template Name, 대상 제품/최소 금액, Reward 제품)이 비면 `Save` 비활성. 멀티 등록은 저장 후 카드의 `Multi Register` 로 진행
- 편집 모드에서는 좌하단에 **`Delete`** 버튼만 노출
### 2-3. 멀티 등록 팝업 (Multi Register)


| 항목 | 규칙 |
| --- | --- |
| 채널 목록 | 상단 헤더 **Brand & Corp** 선택 기준 사용 가능 채널(프로모션 등록 화면과 동일) |
| 채널 체크 | 체크한 채널마다 행 1개 추가(= 프로모션 1건). 해제하면 해당 채널 행 모두 제거 |
| Option Select 템플릿 | 채널명에 `Official` 이 포함된 자사몰 채널만 선택 가능, 그 외 채널은 비활성 |
| Promotion Name | 기본값 `{템플릿 이름} · {채널명}`, 수정 가능, 필수 |
| Start / End | datetime. 기본값 다음날 10:00 ~ +15일 10:00. `Always on` 체크 시 End 비활성·비움 |
| `+ Period` | 같은 채널에 다른 기간 행을 추가(예: 카카오 1차·2차). 이름 뒤에 ` · 2차`, ` · 3차` 자동 부여 |
| 검증 | 채널 1개 이상, 이름·Start 필수, Always on 이 아니면 End 필수 및 End > Start |
| 등록 | 행마다 프로모션 1건을 **Draft** 로 생성해 Promotion List 에 추가. 등록 후 스낵바 안내 |

### 2-4. 템플릿 삭제

- 진입: 카드의 휴지통 아이콘, 편집 팝업의 `Delete` 버튼
- 확인 다이얼로그 `Delete Template` → `Delete` 시 삭제, 스낵바 `Template "{이름}" deleted.`
- 삭제해도 **이미 그 템플릿으로 생성된 프로모션은 영향 없음**(프로모션은 템플릿과 연결을 갖지 않음)

---

## 3. Promotion 등록/수정 화면 연동

헤더 우측 버튼 추가: `[Load Template] [Save as Template]`

### 3-1. Load Template (템플릿 불러오기)

| 항목 | 규칙 |
| --- | --- |
| 노출 조건 | **신규 등록(add) 또는 상태가 `Draft` 인 수정 화면**에서만 노출. Scheduled · Active · Ended · Deleted 에서는 숨김 |
| 팝업 | 타입 필터 칩 + 이름/리워드 검색, 템플릿 행(이름·타입 배지 / Target·Condition / Reward·SAP) 선택 후 `Load Template`(더블클릭·Enter 도 가능) |
| 적용 범위 | 템플릿 기준으로 덮어쓰기 |
| Option Select 템플릿 | 판매 채널을 **자사몰(Official) 채널로 자동 설정** — 사용 가능한 Official 채널이 여러 개면 목록 최상단 1개만 선택(기존 채널 선택은 대체). Official 채널이 없는 Brand & Corp 이면 **템플릿을 적용하지 않고** 알럿 `Template not applicable — This template uses Option Select, which is only available on the official store. The selected Brand & Corp has no official store channel, so the template cannot be applied.` 노출 |
| Reward 재고 | 불러온 Reward 제품은 Total · Sold · Alert 0 으로 시작 → 사용자가 입력 |
| 완료 안내 | 스낵바 `Template "{이름}" loaded. Set the period and sales channel, then save.` |

### 3-2. Save as Template (템플릿으로 등록)

| 항목 | 규칙 |
| --- | --- |
| 노출 조건 | 완전 읽기 전용(Ended · Deleted)이 아닌 모든 등록/수정 화면 |
| 팝업 | `Save as Template` 확인 다이얼로그. Template Name 입력(기본값 = Promotion Name), 비어 있으면 저장 불가 |
| 저장 범위 | 현재 입력된 Basic Info · Target · Reward. Period · Channel · Status · 재고 수량은 저장하지 않음 |
| 중복 | **같은 이름의 템플릿이 있어도 그대로 추가 저장**(중복 등록 허용) |
| 완료 안내 | 스낵바 `Saved as template "{이름}". Find it under Promotion › Template.` |

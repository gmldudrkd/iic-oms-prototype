# 스펙 변경 사항 — 배포 810f2123

- 배포 커밋: `810f2123` (2026-09-10 15:34)
- 직전 배포: `9996fbe2` (2026-09-08 10:58)
- 영향 화면: **Promotion 등록/수정 화면**, **Promotion 상세(조회) 화면**
- 신규 메뉴/라우트 없음

---

## 1. Promotion 등록/수정 — Order Amount 조건 다구간(Range) 확장

Target 조건이 `Order Amount` 인 경우, 기존에는 금액 구간을 **1개만** 설정할 수 있었으나 **최대 5개 구간**으로 확장했습니다.

### 1-1. 변경 전 / 후

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 구간 개수 | 1개 (Minimum / Maximum 1쌍) | **최대 5개** (`Order Amount Ranges (n/5)`) |
| 무제한 설정 | `No maximum limit` 토글 (단일 구간에 적용) | `No maximum limit` 토글, **마지막 구간에서만 사용 가능** |
| 금액 판정 | `최소 금액 ≤ 주문 금액 ≤ 최대 금액` (양끝 포함) | **`하한 ≤ 주문 금액 < 상한`** (하한 포함, 상한 미포함) |
| Reward 제품 | 프로모션 전체에 공통 1세트 | **구간별로 각각 설정** |
| Reward 재고 | 제품별 관리 | **(구간 × 제품) 조합별 관리** |

### 1-2. 구간 설정 규칙

- `+ Add Range` 로 구간 추가, 구간이 2개 이상일 때 개별 삭제 가능
- 구간 사이에 **공백·중복 불가** — 앞 구간의 상한(`<`)이 다음 구간의 하한(`≥`)이 되도록 이웃 구간 경계값을 자동 연동
- 무제한(상한 없음)은 **마지막 구간에서만** 토글 가능
- 화면 안내 문구
  `Max 5 ranges · The upper bound (<) of a range is the lower bound (≥) of the next range · No gaps or overlaps · Only the last range can be unlimited.`
- 구간 표기 형식
  - 상한 있음: `≥ ₩50,000 ~ < ₩100,000`
  - 무제한: `≥ ₩200,000 ~ Unlimited`
- 구간마다 색상 배지(`R1`~`R5`) 부여 — 5색 순환 (`#1F6FE5`, `#7C3AED`, `#C2410C`, `#0F766E`, `#BE185D`)

### 1-3. Reward 영역 — 구간별 관리

- **Reward Type(증정 기준·증정 방식)은 프로모션 전체 공통**, **Reward 제품은 구간별로 설정**
- 섹션 설명 문구
  `Reward type applies to the whole promotion. Reward products are set per order amount range.`
- GWP 재고(`Total` / `Sold` / `Remaining` / `Alert`)는 구간별 제품 단위로 관리
  `GWP manages total/sold/alert quantity per reward product within each range.`
- 증정 방식별 안내 문구 (Order Amount 다구간일 때)

| 증정 방식 | 안내 문구 |
| --- | --- |
| Default Gift | `All reward products set for the matching range are given as gifts.` |
| Option Select | `The customer chooses 1 gift from the reward products of the range their order amount falls into. Up to 10 reward products per range.` |

- Option Select 의 **최대 10개 제한이 구간 단위로 적용** (기존: 프로모션 전체 기준)
- 제한 초과 시 안내: `Option Select can offer up to 10 reward products.`

### 1-4. 필수값 검증 항목 추가

저장 시 누락 항목 목록에 아래 항목이 추가됩니다.

| 검증 조건 | 안내 항목명 |
| --- | --- |
| 첫 구간의 하한 미입력 | `Order Amount (Range N lower bound)` |
| 상한 ≤ 하한 | `Order Amount (Range N upper bound)` |
| 이웃 구간과 경계값 불일치 | `Order Amount (Range N must start where Range N-1 ends)` |
| 구간에 Reward 제품 미등록 | `Reward Product (Range N)` |
| 구간별 제품 Total 미입력 (GWP) | `Reward Total (Range N · 제품명)` |
| 구간별 제품 Alert 미입력 (GWP) | `Reward Alert (Range N · 제품명)` |

### 1-5. 시뮬레이터 / Summary

- 테스트 장바구니 금액이 **속한 구간을 찾아 그 구간의 Reward 만** 적용
- 검증 결과 문구 (`Order amount condition`)
  - 매칭: `₩120,000 → Range 2 (≥ ₩100,000 ~ < ₩200,000)`
  - 미매칭: `₩30,000 does not fall into any range`
- Option Select 인 경우 매칭된 구간의 Reward 목록에서 고객이 고른 1개만 증정
- 잔여 재고도 (구간 × 제품) 기준으로 표시 (`{n} left · 1 given`)
- 우측 Summary 의 Reward 목록은 **`R{구간번호} · 제품명`** 형식 + 구간 색상 배지로 노출

---

## 2. Promotion Delete 안내 문구 변경

적용 화면: **Promotion 등록/수정 화면**, **Promotion 상세(조회) 화면** (두 화면 모두 반영)

| 구분 | 내용 |
| --- | --- |
| 변경 전 | `Delete this promotion? This action is permanent and cannot be undone. All related settings and data will be removed. Type delete to confirm.` |
| 변경 후 | `Delete this promotion? Its status changes to Deleted and it will no longer be applied to any orders. The settings are kept for reference but cannot be edited or restored. Type delete to confirm.` |

- 의미: 물리 삭제가 아니라 **상태를 `Deleted` 로 전환**하는 처리임을 명확히 안내
  - 주문에 더 이상 적용되지 않음
  - 설정값은 조회용으로 보존되며, 수정·복구는 불가
- `delete` 를 직접 입력해야 삭제 확정 (기존과 동일)

---

## 참고 — 이 배포에 포함되지 않은 항목

직전 배포(`9996fbe2`)에 이미 반영되어 있어 이번 배포의 변경분이 아닌 항목입니다.

- Order List: Serial Print 조건 완화 및 Shipment 단위 모달, Tags `Promotion` 옵션
- Order Detail: Category 컬럼, Product Name `P` 태그, AU 채널 Exchange/Reshipment 차단
- Promotion: 상태 체계 변경(Scheduled / Ended / Deleted), 리스트 컬럼 개편(Reward Product · Updated By), Packaging Benefit 규칙
- Stock Transfer 모달 개편 (이동 방향 토글, Transferable Qty, Max All)

아직 배포되지 않은 항목

- Order List Period 필수 입력 및 **최대 180일** 조회 기간 제한

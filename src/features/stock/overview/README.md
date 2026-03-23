# Stock Overview Feature

## 📋 목차

- [개요](#개요)
- [아키텍처](#아키텍처)
- [디렉토리 구조](#디렉토리-구조)
- [데이터 흐름](#데이터-흐름)
- [컴포넌트 구조](#컴포넌트-구조)
- [커스텀 훅](#커스텀-훅)
- [주요 기능](#주요-기능)

---

## 개요

Stock Overview 기능은 온라인 재고와 채널별 재고를 조회하고 관리하는 페이지입니다. 다음과 같은 핵심 기능을 제공합니다:

- **Online Stock Setting**: 온라인 재고 현황 조회 및 안전 재고 수정
- **Channel Stock Setting**: 채널별 재고 현황 조회, 재고 이동, 채널 연동 상태 변경, 예약 판매 설정

---

## 아키텍처

### 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                      index.tsx (메인)                        │
│                    - 탭 전환 관리                             │
│                    - Online/Channel 선택                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴───────────┐
        │                      │
        ▼                      ▼
┌──────────────────┐  ┌──────────────────┐
│ OnlineStock      │  │ ChannelStock     │
│ Setting          │  │ Setting          │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         │ useStockOverviewSetting (공통)
         │                     │
    ┌────┴─────────────────────┴────┐
    │                                │
    ▼                                ▼
┌─────────────────┐          ┌─────────────────┐
│ SearchFilter    │          │ ResultsTable    │
│ 컴포넌트         │          │ 컴포넌트         │
└─────────────────┘          └────────┬────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
              ┌──────────┐      ┌──────────┐    ┌──────────┐
              │ Dialog   │      │ Dialog   │    │ Dialog   │
              │ 컴포넌트 │      │ 컴포넌트 │    │ 컴포넌트 │
              └──────────┘      └──────────┘    └──────────┘
```

---

## 디렉토리 구조

```
overview/
├── components/           # UI 컴포넌트
│   ├── online-stock/               # 온라인 재고 관련
│   │   ├── OnlineStockSetting.tsx
│   │   ├── OnlineStockSearchFilter.tsx
│   │   └── OnlineStockDataGrid.tsx
│   ├── channel-stock/              # 채널 재고 관련
│   │   ├── ChannelStockSetting.tsx
│   │   ├── ChannelStockSearchFilter.tsx
│   │   ├── ChannelStockDataGrid.tsx
│   │   └── ChannelCheckboxCell.tsx
│   ├── safety-stock/               # 안전 재고 관련
│   │   ├── ChangeSafetyStockDialog.tsx
│   │   ├── ChangeSafetyStockAlerts.tsx
│   │   ├── SafetyStockToggle.tsx
│   │   └── PreOrderSafetyStockToggle.tsx
│   ├── channel-send-status/        # 채널 연동 상태 관련
│   │   ├── ChangeChannelSendStatusDialog.tsx
│   │   └── ChangeChannelSendStatusAlerts.tsx
│   ├── pre-order-setting/          # 예약 판매 설정 관련
│   │   ├── PreOrderSettingDialog.tsx
│   │   ├── PreOrderSettingAlerts.tsx
│   │   └── PreOrderSettingSaveAlerts.tsx
│   ├── stock-transfer/             # 재고 이동 관련
│   │   ├── StockTransferDialog.tsx
│   │   ├── StockTransferAlerts.tsx
│   │   └── StockTransferSaveAlerts.tsx
│   ├── stock-export/               # 재고 내보내기 관련
│   │   └── StockExportDialog.tsx
│   └── shared/                     # 공통 컴포넌트
│       └── SearchField.tsx
├── hooks/               # 커스텀 훅
│   ├── online-stock/               # 온라인 재고 관련
│   │   ├── useGetOnlineStockOverview.ts
│   │   └── useOnlineStockSettingColumns.tsx
│   ├── channel-stock/              # 채널 재고 관련
│   │   ├── useGetChannelStockOverview.ts
│   │   └── useChannelStockSettingColumns.tsx
│   ├── safety-stock/               # 안전 재고 관련
│   │   ├── useChangeSafetyStockValidation.ts
│   │   └── usePatchSafetyStock.ts
│   ├── channel-send-status/        # 채널 연동 상태 관련
│   │   ├── useChangeChannelSendStatusDialog.ts
│   │   ├── useChangeChannelSendStatusValidation.ts
│   │   └── usePatchChannelSendStatus.ts
│   ├── pre-order-setting/          # 예약 판매 설정 관련
│   │   ├── usePreOrderSettingDialog.ts
│   │   ├── usePreOrderSettingValidation.ts
│   │   └── usePatchPreOrderSetting.ts
│   ├── stock-transfer/             # 재고 이동 관련
│   │   ├── useStockTransferValidation.ts
│   │   └── usePatchTransferStock.ts
│   ├── stock-export/               # 재고 내보내기 관련
│   │   └── usePostStockExport.ts
│   └── shared/                     # 공통 훅
│       ├── useStockOverviewSetting.ts
│       ├── useStockOverviewFilterForm.ts
│       ├── useStockPagination.ts
│       └── useStockSettingColumns.tsx
├── models/              # 데이터 모델
│   ├── apis.ts                    # API 호출 함수
│   ├── transforms.ts              # 데이터 변환 로직
│   └── types.ts                   # 타입 정의
├── modules/             # 유틸리티
│   ├── constants.ts               # 상수
│   └── styles.ts                  # 스타일 정의
└── index.tsx           # 메인 페이지
```

---

## 데이터 흐름

### 1. 데이터 페칭 흐름

```
사용자 입력 (검색 조건)
    ↓
useStockOverviewFilterForm
    ↓
form.getValues() → searchParams
    ↓
useGetOnlineStockOverview / useGetChannelStockOverview
    ↓
React Query (useQuery)
    ↓
getStockOverview API 호출
    ↓
transformStockDashboardData (데이터 변환)
    ↓
DataGrid 렌더링
```

### 2. 데이터 수정 흐름

```
사용자 액션 (버튼 클릭)
    ↓
Validation 훅 (useStockTransferValidation 등)
    ↓ (통과)
Dialog 열기 (useChangeChannelSendStatusDialog 등)
    ↓
사용자 입력
    ↓
Mutation 훅 (usePatchSafetyStock 등)
    ↓
React Query (useMutation)
    ↓
API 호출 (patchSafetyStock 등)
    ↓
성공 시 Query Invalidation
    ↓
데이터 재조회 및 UI 업데이트
```

---

## 컴포넌트 구조

### 메인 컴포넌트 계층

```
StockOverview (index.tsx)
│
├─ OnlineStockSetting
│  ├─ OnlineStockSearchFilter
│  │  └─ SearchField 등
│  └─ OnlineStockResultsTable
│     ├─ DataGridPro
│     ├─ ChangeSafetyStockDialog
│     ├─ ChangeChannelSendStatusDialog
│     ├─ StockExportDialog
│     └─ ChangeSafetyStockAlerts
│
└─ ChannelStockSetting
   ├─ ChannelStockSearchFilter
   │  └─ SearchField 등
   └─ ChannelStockResultsTable
      ├─ DataGridPro
      ├─ StockTransferDialog
      ├─ ChangeChannelSendStatusDialog
      ├─ PreOrderSettingDialog
      └─ StockTransferAlerts
```

### 주요 컴포넌트 설명

#### 1. **index.tsx** (메인 페이지)

- **역할**: 탭 전환 관리
- **상태**: `currentTab` (Online/Channel Stock Setting)
- **특징**: 두 탭을 모두 DOM에 유지하면서 visibility로 전환 (form 초기화 방지)

#### 2. **OnlineStockSetting / ChannelStockSetting**

- **역할**: 각 탭의 최상위 컨테이너
- **핵심 훅**: `useStockOverviewSetting` (통합 상태 관리)
- **하위 컴포넌트**: SearchFilter + ResultsTable
- **특징**: FormProvider로 form context 제공

#### 3. **ResultsTable 컴포넌트**

- **역할**: 검색 결과를 DataGrid로 표시
- **주요 기능**:
  - 페이지네이션
  - 행 선택 (Online: checkbox, Channel: 커스텀 체크박스)
  - 액션 버튼 (Dialog 열기)
  - 실시간 업데이트 시간 표시

---

## 커스텀 훅

### 1. 데이터 페칭 훅

#### **useGetOnlineStockOverview / useGetChannelStockOverview**

```typescript
// 위치: hooks/online-stock/useGetOnlineStockOverview.ts
//       hooks/channel-stock/useGetChannelStockOverview.ts
// 역할: React Query를 사용한 재고 데이터 조회
// 사용처: OnlineStockSetting / ChannelStockSetting

const { data, isLoading, isFetching, isSuccess } =
  useGetOnlineStockOverview(params);
```

**특징**:

- `placeholderData`를 사용해 이전 데이터 유지
- `enabled` 옵션으로 params 존재 시에만 실행
- Query key 자동 관리

---

### 2. 통합 상태 관리 훅

#### **useStockOverviewSetting**

```typescript
// 위치: hooks/shared/useStockOverviewSetting.ts
// 역할: 검색, 페이지네이션, 데이터 조회를 통합 관리
// 사용처: OnlineStockSetting, ChannelStockSetting

const {
  form, // React Hook Form 인스턴스
  control, // Form control
  channelList, // 채널 목록
  handleSearch, // 검색 실행
  handleReset, // 검색 초기화
  searchParams, // 현재 검색 조건
  data, // 조회된 데이터
  isLoading, // 로딩 상태
  rows, // DataGrid용 변환된 데이터
  paginationModel, // 페이지네이션 모델
  handleChangePaginationModel, // 페이지 변경 핸들러
  UpdatedAt, // 업데이트 시간 컴포넌트
} = useStockOverviewSetting({ useGetData });
```

**핵심 로직**:

1. `searchParams` state로 검색 조건 관리 (Search 버튼 클릭 시에만 업데이트)
2. `useStockOverviewFilterForm`으로 form 초기화 및 채널 목록 관리
3. `useStockPagination`으로 페이지네이션 관리
4. `transformStockDashboardData`로 API 응답을 DataGrid 형식으로 변환
5. `useCurrentTime`으로 마지막 업데이트 시간 추적

**의존 훅**:

- `useStockOverviewFilterForm`: Form 초기화 및 validation
- `useStockPagination`: 페이지 변경 시 searchParams 업데이트
- `useCurrentTime`: 데이터 업데이트 시간 표시

---

### 3. Dialog 관리 훅

#### **useChangeChannelSendStatusDialog**

```typescript
// 위치: hooks/channel-send-status/useChangeChannelSendStatusDialog.ts
// 역할: 채널 연동 상태 변경 Dialog의 열림/닫힘 및 데이터 관리
// 사용처: OnlineStockDataGrid, ChannelStockDataGrid

const {
  open, // Dialog 열림 상태
  offPeriod, // Off Period 데이터
  setOffPeriod, // Off Period 업데이트
  handleOpen, // Dialog 열기
  handleClose, // Dialog 닫기
  handleOpenWithOffPeriod, // 특정 데이터와 함께 Dialog 열기
} = useChangeChannelSendStatusDialog();
```

**사용 패턴**:

```typescript
// 1. 새로운 설정으로 열기
handleOpenWithOffPeriod({
  channelSendStatus: "ON",
  startDate: null,
  endDate: null,
});

// 2. 기존 데이터 수정
handleOpenWithOffPeriod({
  channelSendStatus: "OFF",
  startDate: dayjs(existingStartDate),
  endDate: dayjs(existingEndDate),
});
```

#### **usePreOrderSettingDialog**

```typescript
// 위치: hooks/pre-order-setting/usePreOrderSettingDialog.ts
// 역할: Pre-order 설정 Dialog 관리
// 사용처: ChannelStockDataGrid

const {
  open,
  preOrderSetting,
  handleOpen,
  handleOpenWithPreOrderSetting,
  handleClose,
} = usePreOrderSettingDialog();
```

---

### 4. Validation 훅

#### **useStockTransferValidation**

```typescript
// 위치: hooks/stock-transfer/useStockTransferValidation.ts
// 역할: 재고 이동 전 검증 로직
// 사용처: ChannelStockDataGrid

const { validateStockTransfer } = useStockTransferValidation({
  selectedChannelMap,
});

// 사용 예시
const handleOpenDialog = () => {
  const error = validateStockTransfer();
  if (error) {
    setActiveAlert(error);
    return;
  }
  // Dialog 열기
};
```

**검증 항목**:

- 선택된 항목이 있는지
- 단일 채널만 선택되었는지
- 모든 선택된 채널의 연동 상태가 ON인지

#### **useChangeSafetyStockValidation**

```typescript
// 위치: hooks/safety-stock/useChangeSafetyStockValidation.ts
// 역할: 안전 재고 변경 전 검증
// 사용처: OnlineStockDataGrid

const { validateChangeSafetyStock } = useChangeSafetyStockValidation({
  productTypes,
  selectedRowCount,
});
```

**검증 항목**:

- 선택된 행이 있는지
- Product Type이 단일 선택되었는지 (SINGLE 또는 BUNDLE)

#### **usePreOrderSettingValidation**

```typescript
// 위치: hooks/pre-order-setting/usePreOrderSettingValidation.ts
// 역할: Pre-order 설정 전 검증
// 사용처: ChannelStockDataGrid

const { validatePreOrderSetting } = usePreOrderSettingValidation({
  selectedChannelMap,
});
```

**검증 항목**:

- 선택된 채널이 있는지

---

### 5. 컬럼 정의 훅

#### **useChannelStockSettingColumns / useOnlineStockSettingColumns**

```typescript
// 위치: hooks/channel-stock/useChannelStockSettingColumns.tsx
//       hooks/online-stock/useOnlineStockSettingColumns.tsx
// 역할: DataGrid 컬럼 정의 및 이벤트 핸들러 통합
// 사용처: ChannelStockDataGrid / OnlineStockDataGrid

const { columns, columnGroupingModel } = useChannelStockSettingColumns({
  selectedChannelMap, // 선택된 채널 Map
  onChannelCheckboxChange, // 체크박스 변경 핸들러
  onHeaderCheckboxChange, // 헤더 체크박스 핸들러
  headerCheckboxState, // 헤더 체크박스 상태
  onOffPeriodScheduledClick, // Off Period 클릭 핸들러
  onPreOrderExpiredAtClick, // Pre-order 만료일 클릭 핸들러
});
```

**특징**:

- 동적 채널 컬럼 생성
- 커스텀 셀 렌더러 (체크박스, 버튼 등)
- Column Grouping (제품 정보, 채널별 재고)
- 이벤트 핸들러 주입 패턴

---

### 6. Form 관리 훅

#### **useStockOverviewFilterForm**

```typescript
// 위치: hooks/shared/useStockOverviewFilterForm.ts
// 역할: 검색 필터 form 초기화 및 채널 목록 조회
// 사용처: useStockOverviewSetting

const {
  defaultValues, // Form 기본값
  channelList, // 활성 채널 목록
  form, // React Hook Form 인스턴스
} = useStockOverviewFilterForm();
```

---

### 7. Mutation 훅

#### **usePatchSafetyStock**

```typescript
// 위치: hooks/safety-stock/usePatchSafetyStock.ts
// 역할: 안전 재고 수정 API 호출
// 사용처: ChangeSafetyStockDialog

const mutation = usePatchSafetyStock();
mutation.mutate(data, {
  onSuccess: () => {
    // 성공 처리
  },
});
```

#### **usePatchTransferStock**

```typescript
// 위치: hooks/stock-transfer/usePatchTransferStock.ts
// 역할: 재고 이동 API 호출
// 사용처: StockTransferDialog
```

#### **usePatchChannelSendStatus**

```typescript
// 위치: hooks/channel-send-status/usePatchChannelSendStatus.ts
// 역할: 채널 연동 상태 변경 API 호출
// 사용처: ChangeChannelSendStatusDialog
```

#### **usePatchPreOrderSetting**

```typescript
// 위치: hooks/pre-order-setting/usePatchPreOrderSetting.ts
// 역할: Pre-order 설정 API 호출
// 사용처: PreOrderSettingDialog
```

#### **usePostStockExport**

```typescript
// 위치: hooks/stock-export/usePostStockExport.ts
// 역할: 재고 데이터 엑셀 내보내기
// 사용처: StockExportDialog
```

---

## 주요 기능

### 1. 검색 및 필터링

**구현 위치**: `components/online-stock/OnlineStockSearchFilter` / `components/channel-stock/ChannelStockSearchFilter`

**검색 조건**:

- Brand / Corporation
- Channel Types (Online, Offline, All)
- Product Types (Single, Bundle, All)
- Search Key Type (Product Codes, Product Name, SKU Code)
- Search Keyword
- Channel Send Status (ON, OFF, All)
- 기타 필터 (Zero Quantity 제외 옵션)

**검색 흐름**:

```typescript
// 1. 사용자가 조건 입력
// 2. Search 버튼 클릭
handleSearch()
  → form.getValues()
  → setSearchParams()
  → useQuery 자동 재실행
  → 데이터 조회
```

---

### 2. 행 선택 메커니즘

#### Online Stock (표준 체크박스)

```typescript
const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>([]);

// DataGrid의 checkboxSelection 사용
<DataGridPro
  checkboxSelection
  rowSelectionModel={rowSelectionModel}
  onRowSelectionModelChange={handleRowSelectionModelChange}
/>
```

#### Channel Stock (채널별 커스텀 체크박스)

```typescript
const [selectedChannelMap, setSelectedChannelMap] = useState<
  Map<string, ChannelSelection>
>(new Map());

// 채널별로 개별 선택 (제품 × 채널 조합)
const handleChannelCheckboxChange = (
  rowId: string,
  sku: string,
  channelName: string,
  checked: boolean,
  channelData: ChannelStockData,
) => {
  const key = `${rowId}-${channelName}`;
  setSelectedChannelMap((prev) => {
    const newMap = new Map(prev);
    if (checked) {
      newMap.set(key, { rowId, sku, channelName, channelData });
    } else {
      newMap.delete(key);
    }
    return newMap;
  });
};
```

**차이점**:

- Online: 제품 단위 선택
- Channel: 제품 × 채널 조합 단위 선택 (예: SKU123 × Smartstore)

---

### 3. Dialog 관리 패턴

모든 Dialog는 동일한 패턴을 따릅니다:

```typescript
// 1. Dialog 상태 관리 훅
const {
  open,
  data,
  handleOpen,
  handleOpenWithData,
  handleClose,
} = useXxxDialog();

// 2. Validation 훅
const { validate } = useXxxValidation({ ... });

// 3. 열기 핸들러
const handleOpenDialog = () => {
  const error = validate();
  if (error) {
    setActiveAlert(error);
    return;
  }
  handleOpenWithData(initialData);
};

// 4. Dialog 컴포넌트
<XxxDialog
  open={open}
  setOpen={setOpen}
  data={data}
  onClose={handleClose}
/>
```

---

### 4. 데이터 변환 (Transforms)

#### **transformStockDashboardData**

**역할**: API 응답을 DataGrid에 적합한 평면 구조로 변환

**입력 (API 응답)**:

```typescript
{
  productType: { name: "SINGLE", description: "단품" },
  sku: "SKU123",
  products: [{
    productName: "Product A",
    channelStocks: [
      { channel: { name: "SMARTSTORE" }, ... },
      { channel: { name: "COUPANG" }, ... },
    ]
  }]
}
```

**출력 (DataGrid Row)**:

```typescript
{
  id: "SKU123",
  productType: "단품",
  sku: "SKU123",
  productName: "Product A",
  erp: 100,
  safety: 10,
  undistributed: 50,
  channelStocks: [
    {
      channel: "Smartstore",
      channelEnum: "SMARTSTORE",
      distributed: 30,
      available: 25,
      status: "ON",
      offPeriod: null,
      ...
    },
    {
      channel: "Coupang",
      ...
    },
    {
      channel: "Total",  // 자동 계산된 Total 행
      distributed: 50,
      ...
    }
  ]
}
```

**특징**:

- 채널 데이터를 배열로 보관 (`channelStocks`)
- Total 행 자동 계산
- Stock Status 자동 계산 (IN_STOCK, OUT_OF_STOCK, OVERSELLING)
- Off Period 포맷팅

---

### 5. 실시간 업데이트 시간 표시

**구현**: `useCurrentTime` 훅 사용

```typescript
const { UpdatedAt } = useCurrentTime({
  isFetching,
  isSuccess,
  format: "YYYY-MM-DD hh:mm:ss A",
});

// 컴포넌트에서 사용
<UpdatedAt />
```

**동작**:

- 데이터 fetch 완료 시 현재 시간으로 업데이트
- 실시간으로 초 단위 갱신

---

### 6. 페이지네이션

**구현**: `useStockPagination` 훅

```typescript
const { paginationModel, handleChangePaginationModel } = useStockPagination({
  searchParams,
  setSearchParams,
});

// 페이지 변경 시 searchParams 업데이트
handleChangePaginationModel({ page: 1, pageSize: 50 });
  → setSearchParams({ ...searchParams, page: 1, size: 50 })
  → useQuery 자동 재실행
```

---

## Models Layer

### apis.ts

**역할**: API 호출 함수 정의

```typescript
// 재고 조회
getStockOverview(type: "online" | "channel", params)

// 수정 API
patchSafetyStock(data)
patchStockTransfer(data)
patchChannelSendStatus(data)
patchPreOrderSetting(data)

// 내보내기
postStockExport(data)
```

### transforms.ts

**역할**: 데이터 변환 로직

```typescript
transformStockDashboardData(data): FlattenedStockRow[]
```

### types.ts

**역할**: 타입 정의

```typescript
StockDashboardRequestForm; // 검색 조건 Form 타입
ChannelSelection; // 선택된 채널 정보
OffPeriod; // Off Period 데이터
PreOrderSetting; // Pre-order 설정 데이터
```

---

## 주요 상태 관리 패턴

### 1. 검색 상태 분리

```typescript
// Form 상태 (입력 중)
const form = useForm();

// 실제 검색 상태 (Search 버튼 클릭 시에만 업데이트)
const [searchParams, setSearchParams] = useState(null);

// 이점: 입력 중에는 API 호출하지 않음
```

### 2. 선택 상태 관리 (Map 사용)

```typescript
// Online: 간단한 행 선택
const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>([]);

// Channel: 복잡한 채널별 선택 (Map 사용으로 효율성 향상)
const [selectedChannelMap, setSelectedChannelMap] = useState<
  Map<string, ChannelSelection>
>(new Map());
```

### 3. Dialog 상태 캡슐화

```typescript
// 각 Dialog는 독립적인 커스텀 훅으로 관리
const dialogState = useXxxDialog();

// 재사용 가능하고 테스트 용이
```

---

## 개발 가이드

### 새로운 Dialog 추가하기

1. **Dialog 컴포넌트 생성** (예: `components/new-feature/NewDialog.tsx`)
2. **Dialog 관리 훅 생성** (예: `hooks/new-feature/useNewDialog.ts`)

```typescript
export function useNewDialog() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialData);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setData(initialData);
  }, []);

  return { open, data, handleOpen, handleClose };
}
```

3. **Validation 훅 생성** (필요시)
4. **Mutation 훅 생성** (API 호출)
5. **ResultsTable에 통합**

### 새로운 컬럼 추가하기

1. `hooks/channel-stock/useChannelStockSettingColumns.tsx` 또는 `hooks/online-stock/useOnlineStockSettingColumns.tsx` 수정
2. `hooks/shared/useStockSettingColumns.tsx`에서 기본 컬럼 정의 수정
3. `models/transforms.ts`에서 데이터 변환 로직 추가
4. 타입 정의 업데이트 (`models/types.ts`, `shared/generated/oms/types/Stock.ts`)

---

## 성능 최적화

### 1. React.memo 사용

```typescript
export default memo(ChannelStockResultsTable);
```

### 2. useCallback으로 핸들러 메모이제이션

```typescript
const handleSearch = useCallback(() => {
  setSearchParams(form.getValues());
}, [form]);
```

### 3. useMemo로 연산 결과 캐싱

```typescript
const rows = useMemo(() => {
  return data?.data ? transformStockDashboardData(data.data) : [];
}, [data]);
```

### 4. React Query placeholderData

```typescript
useQuery({
  queryKey: [...],
  queryFn: ...,
  placeholderData: (previousData) => previousData,  // 이전 데이터 유지
});
```

---

## 문제 해결

### Q: 탭 전환 시 form이 초기화되는 문제

**A**: `index.tsx`에서 `position: absolute`와 `visibility` 속성을 사용하여 두 탭을 모두 DOM에 유지

### Q: 채널 선택이 느린 문제

**A**: `Map` 자료구조 사용으로 O(1) 조회 시간 보장

### Q: 데이터 변경 후 즉시 반영되지 않는 문제

**A**: Mutation의 `onSuccess`에서 `queryClient.invalidateQueries()` 호출

---

## 참고 자료

- [React Query 문서](https://tanstack.com/query/latest)
- [React Hook Form 문서](https://react-hook-form.com/)
- [MUI DataGrid 문서](https://mui.com/x/react-data-grid/)

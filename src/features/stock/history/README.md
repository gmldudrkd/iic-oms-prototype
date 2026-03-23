# Stock History Feature

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

Stock History 기능은 재고 변경 이력을 조회하고 분석하는 페이지입니다. 다음과 같은 핵심 기능을 제공합니다:

- **Stock History Chart**: 시간대별 재고 변동을 시각화한 차트
- **Stock History DataGrid**: Snapshot 형태의 재고 변동 이력 테이블
- **Stock History Detail Dialog**: 특정 시점의 상세 재고 변동 이력 (Online/Channel)

---

## 아키텍처

### 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                      index.tsx (메인)                        │
│                    - 검색 조건 관리                           │
│                    - 데이터 페칭                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┼───────────┐
        │          │           │
        ▼          ▼           ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ SearchFilter │ │ StockHistory │ │ StockHistory │
│              │ │ Chart        │ │ DataGrid     │
└──────────────┘ └──────────────┘ └──────┬───────┘
                                         │
                                         ▼
                              ┌──────────────────┐
                              │ DetailDialog     │
                              │ (Online/Channel) │
                              └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
              ┌──────────┐      ┌──────────┐      ┌──────────┐
              │ Online   │      │ Channel  │      │ Product  │
              │ History  │      │ History  │      │ InfoTable│
              └──────────┘      └──────────┘      └──────────┘
```

---

## 디렉토리 구조

```
history/
├── components/                    # UI 컴포넌트
│   ├── channel-stock-history/              # 채널 재고 이력 관련
│   │   ├── ChannelStockHistoryDataGrid.tsx
│   │   └── ChannelStockHistoryFilter.tsx
│   ├── online-stock-history/               # 온라인 재고 이력 관련
│   │   ├── OnlineStockHistoryDataGrid.tsx
│   │   └── OnlineStockHistoryFilter.tsx
│   ├── shared/                             # 공통 컴포넌트
│   │   ├── ProductInfoTable.tsx
│   │   ├── StockHistoryDataGrid.tsx
│   │   ├── StockHistoryDetailDialog.tsx
│   │   └── StockHistorySearchFilter.tsx
│   └── stock-history-chart/                # 차트 관련
│       ├── ChartLegend.tsx
│       ├── FilterItem.tsx
│       ├── FilterSection.tsx
│       └── StockHistoryChart.tsx
├── hooks/                         # 커스텀 훅
│   ├── channel-stock-history/              # 채널 재고 이력 관련
│   │   ├── useChannelStockHistoryDataGridColumns.tsx
│   │   └── useGetChannelStockHistory.ts
│   ├── online-stock-history/               # 온라인 재고 이력 관련
│   │   ├── useGetOnlineStockHistory.ts
│   │   └── useOnlineStockHistoryDataGridColumns.tsx
│   ├── shared/                             # 공통 훅
│   │   ├── useGetStockHistory.ts
│   │   ├── useStockHistoryDataGridColumns.tsx
│   │   ├── useStockHistoryDetailSearchFilterForm.ts
│   │   └── useStockHistorySearchFilterForm.ts
│   └── stock-history-chart/                # 차트 관련
│       ├── useChartData.ts
│       └── useChartFilters.ts
├── models/                        # 데이터 모델
│   ├── apis.ts                            # API 호출 함수
│   ├── transforms.ts                      # 데이터 변환 로직
│   └── types.ts                           # 타입 정의
├── modules/                       # 유틸리티
│   ├── constants.ts                       # 상수
│   ├── styles.ts                          # 스타일 정의
│   └── utils.ts                           # 유틸리티 함수
└── index.tsx                      # 메인 페이지
```

---

## 데이터 흐름

### 1. 메인 데이터 페칭 흐름

```
사용자 입력 (검색 조건)
    ↓
useStockHistorySearchFilterForm
    ↓
form.getValues() → searchParams
    ↓
useGetStockHistory
    ↓
React Query (useQuery)
    ↓
getStockHistory API 호출
    ↓
StockHistoryChart / StockHistoryDataGrid 렌더링
```

### 2. 상세 이력 조회 흐름

```
DataGrid 셀 클릭 (DateTime)
    ↓
handleOpenDetailDialog
    ↓
useStockHistoryDetailSearchFilterForm
    ↓
StockHistoryDetailDialog 열기
    ↓
useGetOnlineStockHistory / useGetChannelStockHistory
    ↓
React Query (useQuery)
    ↓
Online/Channel History DataGrid 렌더링
```

---

## 컴포넌트 구조

### 메인 컴포넌트 계층

```
StockHistory (index.tsx)
│
├─ StockHistorySearchFilter
│  ├─ DatePicker (Start/End Date)
│  ├─ Select (Time Unit: Daily/Hourly)
│  └─ TextField (Search)
│
├─ StockHistoryChart
│  ├─ ProductInfoTable
│  ├─ FilterSection (Online Qty)
│  ├─ FilterSection (Channel)
│  ├─ ChartLegend
│  └─ LineChart
│
└─ StockHistoryDataGrid
   ├─ DataGridPro (Snapshot)
   └─ StockHistoryDetailDialog
      ├─ ProductInfoTable
      ├─ Tabs (Online / Channel)
      ├─ OnlineStockHistoryFilter
      ├─ OnlineStockHistoryDataGrid
      ├─ ChannelStockHistoryFilter
      └─ ChannelStockHistoryDataGrid
```

### 주요 컴포넌트 설명

#### 1. **index.tsx** (메인 페이지)

- **역할**: 검색 조건 관리 및 데이터 페칭
- **상태**: `searchParams` (검색 조건)
- **특징**: FormProvider로 form context 제공

#### 2. **StockHistoryChart**

- **역할**: 시간대별 재고 변동 시각화
- **핵심 훅**: `useChartFilters`, `useChartData`
- **기능**:
  - Online Qty 필터 (ERP, ERP Update, Safety, Undistributed)
  - Channel 필터 (동적 채널 목록)
  - 실시간 업데이트 시간 표시

#### 3. **StockHistoryDataGrid**

- **역할**: Snapshot 형태의 재고 변동 테이블
- **핵심 훅**: `useStockHistoryDataGridColumns`
- **기능**:
  - Column Grouping (Online Qty, Channel Qty)
  - DateTime 셀 클릭 시 상세 Dialog 열기
  - 채널별 세로 분할 셀 렌더링

#### 4. **StockHistoryDetailDialog**

- **역할**: 특정 시점의 상세 재고 변동 이력
- **핵심 훅**: `useGetOnlineStockHistory`, `useGetChannelStockHistory`
- **기능**:
  - Online/Channel 탭 전환
  - 이벤트 필터링 (Events)
  - 채널 선택 필터링

---

## 커스텀 훅

### 1. 데이터 페칭 훅

#### **useGetStockHistory**

```typescript
// 위치: hooks/shared/useGetStockHistory.ts
// 역할: 메인 재고 이력 데이터 조회
// 사용처: index.tsx

const { data, isLoading, isError, isSuccess, isFetching } =
  useGetStockHistory(searchParams);
```

#### **useGetOnlineStockHistory**

```typescript
// 위치: hooks/online-stock-history/useGetOnlineStockHistory.ts
// 역할: 온라인 재고 상세 이력 조회
// 사용처: StockHistoryDetailDialog

const { data } = useGetOnlineStockHistory({
  params,
  sku,
  isDialogOpen,
});
```

#### **useGetChannelStockHistory**

```typescript
// 위치: hooks/channel-stock-history/useGetChannelStockHistory.ts
// 역할: 채널 재고 상세 이력 조회
// 사용처: StockHistoryDetailDialog

const { data } = useGetChannelStockHistory({
  params,
  sku,
  isDialogOpen,
});
```

---

### 2. Form 관리 훅

#### **useStockHistorySearchFilterForm**

```typescript
// 위치: hooks/shared/useStockHistorySearchFilterForm.ts
// 역할: 검색 필터 form 초기화 및 상태 관리
// 사용처: index.tsx

const { form, defaultValues, searchParams, setSearchParams } =
  useStockHistorySearchFilterForm();
```

#### **useStockHistoryDetailSearchFilterForm**

```typescript
// 위치: hooks/shared/useStockHistoryDetailSearchFilterForm.ts
// 역할: 상세 Dialog form 초기화 및 상태 관리
// 사용처: StockHistoryDataGrid

const { form, defaultValues } = useStockHistoryDetailSearchFilterForm();
```

---

### 3. 차트 관련 훅

#### **useChartFilters**

```typescript
// 위치: hooks/stock-history-chart/useChartFilters.ts
// 역할: 차트 필터 상태 관리 (Online Qty, Channel)
// 사용처: StockHistoryChart

const {
  onlineQtyFilters,
  channelFilters,
  availableChannels,
  allOnlineQtySelected,
  someOnlineQtySelected,
  allChannelsSelected,
  someChannelsSelected,
  handleToggleAllOnlineQty,
  handleToggleAllChannels,
  handleOnlineQtyFilterChange,
  handleChannelFilterChange,
} = useChartFilters(historyData);
```

#### **useChartData**

```typescript
// 위치: hooks/stock-history-chart/useChartData.ts
// 역할: 차트 데이터 변환 (X축, Series 생성)
// 사용처: StockHistoryChart

const { xAxisData, series } = useChartData({
  historyData,
  onlineQtyFilters,
  channelFilters,
  availableChannels,
});
```

---

### 4. 컬럼 정의 훅

#### **useStockHistoryDataGridColumns**

```typescript
// 위치: hooks/shared/useStockHistoryDataGridColumns.tsx
// 역할: Snapshot DataGrid 컬럼 정의
// 사용처: StockHistoryDataGrid

const { columns, columnGroupingModel } = useStockHistoryDataGridColumns({
  handleOpenDetailDialog,
});
```

#### **useOnlineStockHistoryDataGridColumns**

```typescript
// 위치: hooks/online-stock-history/useOnlineStockHistoryDataGridColumns.tsx
// 역할: Online 상세 이력 DataGrid 컬럼 정의
// 사용처: OnlineStockHistoryDataGrid

const { columns, columnGroupingModel } = useOnlineStockHistoryDataGridColumns();
```

#### **useChannelStockHistoryDataGridColumns**

```typescript
// 위치: hooks/channel-stock-history/useChannelStockHistoryDataGridColumns.tsx
// 역할: Channel 상세 이력 DataGrid 컬럼 정의
// 사용처: ChannelStockHistoryDataGrid

const { columns, columnGroupingModel } =
  useChannelStockHistoryDataGridColumns();
```

---

## 주요 기능

### 1. 검색 및 필터링

**구현 위치**: `components/shared/StockHistorySearchFilter.tsx`

**검색 조건**:

- Start Date / End Date
- Time Unit (Daily / Hourly)
- Search Key Type (SKU Code, SAP Code, SAP Name)
- Search Keyword

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

### 2. 차트 시각화

**구현 위치**: `components/stock-history-chart/StockHistoryChart.tsx`

**기능**:

- Online Qty 라인 (ERP, ERP Update, Safety, Undistributed)
- Channel Qty 라인 (Distributed: 실선, Available: 점선)
- 필터 토글 (전체 선택/해제, 개별 선택)
- 채널별 랜덤 색상 생성

**필터 상태 관리**:

```typescript
// Online Qty 필터
const [onlineQtyFilters, setOnlineQtyFilters] = useState({
  ERP: true,
  "ERP Update": true,
  Safety: true,
  Undistributed: true,
});

// Channel 필터
const [channelFilters, setChannelFilters] = useState<Record<string, boolean>>(
  {},
);
```

---

### 3. DataGrid 컬럼 그룹핑

**구현 위치**: `hooks/shared/useStockHistoryDataGridColumns.tsx`

**컬럼 구조**:

```typescript
const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "onlineQty",
    headerName: "Online Qty",
    children: [
      { field: "erp" },
      { field: "erpUpdate" },
      { field: "safety" },
      { field: "undistributed" },
    ],
  },
  {
    groupId: "channelQty",
    headerName: "Channel Qty",
    children: [
      { field: "channelStocks" },
      { field: "distributed" },
      { field: "preOrder" },
      { field: "used" },
      { field: "shipped" },
      { field: "available" },
    ],
  },
];
```

---

### 4. 상세 Dialog

**구현 위치**: `components/shared/StockHistoryDetailDialog.tsx`

**기능**:

- Online / Channel 탭 전환
- Events 필터링 (Online: UPDATE_ONLINE_STOCK, UPDATE_MOVEMENT, UPDATE_SAFETY)
- Channel 선택 필터링
- 수량 변화 표시 (증가: 파란색 +, 감소: 빨간색 -)

**수량 변화 렌더링**:

```typescript
const renderQtyCell = (value: number, change: number) => {
  if (change === 0) {
    return <Typography>{value}</Typography>;
  }

  const isIncrease = change > 0;
  const changeColor = isIncrease ? "#2196F3" : "#F44336";
  const changeText = isIncrease ? `+${change}` : `${change}`;

  return (
    <Box>
      <Typography>{value}</Typography>
      <Typography sx={{ color: changeColor }}>({changeText})</Typography>
    </Box>
  );
};
```

---

## Models Layer

### apis.ts

**역할**: API 호출 함수 정의

```typescript
// 재고 이력 조회 (메인)
getStockHistory(params: StockHistorySearchFilterForm)

// 온라인 재고 상세 이력 조회
getOnlineStockHistory({ params, sku })

// 채널 재고 상세 이력 조회
getChannelStockHistory({ params, sku })
```

### transforms.ts

**역할**: 데이터 변환 로직

```typescript
transformStockHistoryData(data): TransformedStockHistoryRow[];
```

### types.ts

**역할**: 타입 정의

```typescript
StockHistorySearchFilterForm; // 검색 조건 Form 타입
StockHistoryDetailParamsForm; // 상세 Dialog Form 타입
CurrentSearchKeyType; // 검색 키 타입 (sku, productCode, productName)
StockHistoryTabType; // 탭 타입 (online, channel)
```

---

## 성능 최적화

### 1. useMemo로 연산 결과 캐싱

```typescript
const transformedRows = useMemo(() => {
  return transformStockHistoryData(rows);
}, [rows]);
```

### 2. React Query placeholderData

```typescript
useQuery({
  queryKey: [...],
  queryFn: ...,
  placeholderData: (previousData) => previousData,
});
```

### 3. enabled 옵션으로 불필요한 API 호출 방지

```typescript
useQuery({
  queryKey: [...],
  queryFn: ...,
  enabled: !!params && isDialogOpen,
});
```

---

## 개발 가이드

### 새로운 이벤트 필터 추가하기

1. `modules/constants.ts`에 이벤트 상수 추가
2. `OnlineStockHistoryFilter.tsx` 또는 `ChannelStockHistoryFilter.tsx`에 필터 옵션 추가
3. API 요청 시 events 파라미터에 포함

### 새로운 컬럼 추가하기

1. `hooks/shared/useStockHistoryDataGridColumns.tsx` 수정
2. `models/transforms.ts`에서 데이터 변환 로직 추가
3. 타입 정의 업데이트

---

## 참고 자료

- [React Query 문서](https://tanstack.com/query/latest)
- [React Hook Form 문서](https://react-hook-form.com/)
- [MUI DataGrid 문서](https://mui.com/x/react-data-grid/)
- [MUI Charts 문서](https://mui.com/x/react-charts/)


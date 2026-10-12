"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FieldLabel,
  Note,
  SectionCard,
  Segmented,
} from "@/features/promotion-template/components/atoms";
import ProductPicker from "@/features/promotion-template/components/ProductPicker";
import {
  BORDER,
  BRAND,
  BRAND_SOFT,
  CUSTOM_GOAL,
  GOALS,
  MAX_AMOUNT_RANGES,
  PRODUCT_BY_SAP,
  REWARD_BASIS_OPTIONS,
  REWARD_TYPE_OPTIONS,
  SURFACE_SUNKEN,
  TARGET_MODE_OPTIONS,
  TEMPLATE_TYPE_OPTIONS,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  inputSx,
  isRewardProduct,
  isTargetProduct,
  rangeColor,
} from "@/features/promotion-template/modules/constants";
import {
  PromotionTemplate,
  TemplateAmountRange,
  TemplateDraft,
  TemplateProduct,
} from "@/features/promotion-template/modules/types";
import {
  normalizeDraft,
  rangeText,
  validateTemplate,
} from "@/features/promotion-template/modules/utils";

const emptyRange = (): TemplateAmountRange => ({
  min: 0,
  max: 0,
  unlimited: true,
  rewards: [],
});

const emptyDraft = (): TemplateDraft => ({
  name: "",
  type: "GWP",
  goal: GOALS[0],
  tmode: "product",
  basis: "any",
  skus: [],
  amountRanges: [emptyRange()],
  qty: 1,
  rewardBasis: "per_order",
  multiplier: 1,
  rewardType: "default",
  rewards: [],
});

const toDraft = (t: PromotionTemplate): TemplateDraft => ({
  name: t.name,
  type: t.type,
  goal: t.goal,
  tmode: t.tmode,
  basis: t.basis,
  skus: [...t.skus],
  // 구간이 없는 템플릿(Order Amount 외)은 Order Amount 로 바꿀 때를 위해 빈 구간 1개로 시작
  amountRanges: t.amountRanges.length
    ? t.amountRanges.map((r) => ({ ...r, rewards: [...r.rewards] }))
    : [emptyRange()],
  qty: t.qty,
  rewardBasis: t.rewardBasis,
  multiplier: t.multiplier,
  rewardType: t.rewardType,
  rewards: [...t.rewards],
});

interface Props {
  open: boolean;
  // null 이면 신규
  editing: PromotionTemplate | null;
  onClose: () => void;
  onSave: (draft: TemplateDraft) => void;
  // 편집 중인 템플릿 삭제 (확인은 호출 측에서)
  onDelete?: (t: PromotionTemplate) => void;
}

const numberSx = {
  ...inputSx,
  width: 96,
  "& input": {
    textAlign: "right",
    fontFamily: "ui-monospace, Menlo, monospace",
  },
};

// 템플릿 등록·편집 팝업(중앙 모달) — Create Promotion 의 Basic Info · Target · Reward 만 담는다
export default function TemplateFormDialog({
  open,
  editing,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<TemplateDraft>(emptyDraft);

  // Promotion Goal 이 선택지 밖의 값이면 Custom 직접 입력 모드
  const [customGoal, setCustomGoal] = useState(false);

  useEffect(() => {
    if (open) {
      const next = editing ? toDraft(editing) : emptyDraft();
      setDraft(next);
      setCustomGoal(!GOALS.includes(next.goal));
    }
  }, [open, editing]);

  const patch = useCallback(
    (p: Partial<TemplateDraft>) => setDraft((d) => ({ ...d, ...p })),
    [],
  );

  const error = useMemo(() => validateTemplate(draft), [draft]);
  const isGwp = draft.type === "GWP";
  const isOption = draft.rewardType === "option";

  // Packaging Benefit 은 Reward 로 Packaging 카테고리 제품만 허용
  const rewardFilter = useCallback(
    (p: TemplateProduct) =>
      isGwp ? isRewardProduct(p) : p.category === "Packaging",
    [isGwp],
  );

  // Target 변경 — All Products 는 Reward Type 을 사용하지 않으므로 Default Gift 로 고정 (프로모션 등록 화면과 동일)
  const setTmode = (tmode: TemplateDraft["tmode"]) =>
    patch(tmode === "all" ? { tmode, rewardType: "default" } : { tmode });

  // ---- Order Amount 구간 mutations (프로모션 등록 화면과 동일 규칙) ----
  // 구간 사이에 공백/중복이 생기지 않도록 이웃 구간의 경계값을 함께 맞춘다
  const setRanges = (
    fn: (ranges: TemplateAmountRange[]) => TemplateAmountRange[],
  ) => setDraft((d) => ({ ...d, amountRanges: fn(d.amountRanges) }));

  const patchRange = (idx: number, p: Partial<TemplateAmountRange>) =>
    setRanges((prev) => {
      const ranges = prev.map((r, i) => (i === idx ? { ...r, ...p } : r));
      if (p.max !== undefined && ranges[idx + 1])
        ranges[idx + 1] = { ...ranges[idx + 1], min: p.max };
      if (p.min !== undefined && idx > 0)
        ranges[idx - 1] = { ...ranges[idx - 1], max: p.min };
      return ranges;
    });

  // 무제한은 마지막 구간만 가질 수 있으므로 새로 추가된 구간으로 넘긴다
  const addRange = () =>
    setRanges((prev) => {
      if (prev.length >= MAX_AMOUNT_RANGES) return prev;
      const lastIdx = prev.length - 1;
      const last = prev[lastIdx];
      const boundary = last.unlimited ? last.min : last.max;
      return [
        ...prev.map((r, i) =>
          i === lastIdx ? { ...r, unlimited: false, max: boundary } : r,
        ),
        { min: boundary, max: 0, unlimited: last.unlimited, rewards: [] },
      ];
    });

  // 삭제된 자리를 기준으로 앞뒤 구간을 다시 이어 붙인다
  const removeRange = (idx: number) =>
    setRanges((prev) => {
      if (prev.length <= 1) return prev;
      const removed = prev[idx];
      const ranges = prev.filter((_, i) => i !== idx);
      if (idx === 0) ranges[0] = { ...ranges[0], min: removed.min };
      else if (ranges[idx])
        ranges[idx] = { ...ranges[idx], min: ranges[idx - 1].max };
      if (removed.unlimited)
        ranges[ranges.length - 1] = {
          ...ranges[ranges.length - 1],
          unlimited: true,
        };
      return ranges;
    });

  const toggleLastUnlimited = () =>
    setRanges((prev) =>
      prev.map((r, i) =>
        i === prev.length - 1 ? { ...r, unlimited: !r.unlimited } : r,
      ),
    );

  // Packaging Benefit 으로 바꾸면 Packaging 카테고리가 아닌 Reward 제품만 제거
  // (Reward Type 은 유지 — Option Select 는 타입과 무관하게 사용 가능, 프로모션 등록 화면과 동일)
  // 또한 Reward Basis 는 Per product quantity 로 고정되고 Target = Order Amount 는 사용할 수 없다
  // (Order Amount 였다면 Specific Product 로 전환) — 프로모션 등록 화면과 동일 규칙
  const setType = (type: TemplateDraft["type"]) => {
    if (type === "PACKAGE") {
      patch({
        type,
        rewardBasis: "per_qty",
        tmode: draft.tmode === "amount" ? "product" : draft.tmode,
        rewards: draft.rewards.filter(
          (s) => PRODUCT_BY_SAP[s]?.category === "Packaging",
        ),
      });
      return;
    }
    patch({ type });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxWidth: 820,
          maxHeight: "92vh",
          background: "#F5F5F5",
          color: TEXT_PRIMARY,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: `1px solid ${BORDER}`,
          background: "#fff",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 12,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: TEXT_TERTIARY,
              fontWeight: 500,
            }}
          >
            {editing ? "Edit Template" : "New Template"}
          </Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
            {editing ? editing.name : "Create Template"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>
      </Box>

      {/* body */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <SectionCard num="1" title="Basic Info">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <FieldLabel>Template Name</FieldLabel>
            <TextField
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="e.g. Holiday Perfume Gift GWP"
              fullWidth
              autoFocus
              sx={inputSx}
            />
            <Note>
              The same name can be used for more than one template (duplicate
              registration is allowed).
            </Note>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <FieldLabel>Promotion Type</FieldLabel>
            <Segmented
              value={draft.type}
              onChange={setType}
              options={TEMPLATE_TYPE_OPTIONS}
            />
            <Note>
              {isGwp
                ? "GWP applies to a single channel only. Multi Register creates one promotion per channel, and reward quantity is managed per channel."
                : "Packaging Benefit gives a packaging reward whenever target products are purchased. No quantity management — only a start date per channel."}
            </Note>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <FieldLabel>Promotion Goal</FieldLabel>
            <Select
              value={customGoal ? CUSTOM_GOAL : draft.goal}
              onChange={(e) => {
                const v = e.target.value;
                if (v === CUSTOM_GOAL) {
                  setCustomGoal(true);
                  patch({ goal: "" });
                } else {
                  setCustomGoal(false);
                  patch({ goal: v });
                }
              }}
              sx={{
                height: 44,
                borderRadius: "10px",
                fontSize: 14,
                background: "#fff",
                "& fieldset": { borderColor: BORDER, borderWidth: "1.5px" },
              }}
            >
              {GOALS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
              <MenuItem value={CUSTOM_GOAL}>Custom</MenuItem>
            </Select>
            {customGoal && (
              <TextField
                value={draft.goal}
                onChange={(e) => patch({ goal: e.target.value })}
                placeholder="Enter a custom promotion goal"
                fullWidth
                sx={{
                  ...inputSx,
                  "& .MuiOutlinedInput-root": {
                    ...inputSx["& .MuiOutlinedInput-root"],
                    background: BRAND_SOFT,
                  },
                }}
              />
            )}
          </Box>
          <Note>
            Period (Start · End · Always on) and Promotion Status are not part
            of a template. They differ by channel, so they are entered per
            channel in Multi Register.
          </Note>
        </SectionCard>

        <SectionCard num="2" title="Target">
          <Segmented
            value={draft.tmode}
            onChange={setTmode}
            // Packaging Benefit 은 Order Amount 조건을 사용할 수 없다
            options={TARGET_MODE_OPTIONS.map((o) =>
              o.value === "amount" ? { ...o, disabled: !isGwp } : o,
            )}
          />
          {!isGwp && (
            <Note>Order Amount is not available for Packaging Benefit.</Note>
          )}

          {draft.tmode === "product" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <FieldLabel>Target Purchase Basis</FieldLabel>
                <Segmented
                  size="sm"
                  value={draft.basis}
                  onChange={(basis) => patch({ basis })}
                  options={[
                    { value: "any", label: "Any" },
                    { value: "all", label: "All" },
                  ]}
                />
                <Note>
                  {draft.basis === "any"
                    ? "Any one of the selected products satisfies the condition."
                    : "All selected products must be in the order."}
                </Note>
              </Box>
              <ProductPicker
                label="Add Target Product"
                value={draft.skus}
                onChange={(skus) => patch({ skus })}
                filter={isTargetProduct}
                emptyText="Search and add target products below."
              />
            </Box>
          )}

          {draft.tmode === "amount" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <FieldLabel>
                Order Amount Ranges ({draft.amountRanges.length}/
                {MAX_AMOUNT_RANGES})
              </FieldLabel>
              <Note>
                Lower bound is inclusive (≤), upper bound is exclusive (&lt;).
                Each range gets its own reward products in step 3.
              </Note>
              {draft.amountRanges.map((r, i) => {
                const isLast = i === draft.amountRanges.length - 1;
                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      flexWrap: "wrap",
                      p: "10px 12px",
                      border: `1px solid ${BORDER}`,
                      borderRadius: "10px",
                      background: "#fff",
                    }}
                  >
                    <Chip
                      label={`Range ${i + 1}`}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        background: rangeColor(i),
                      }}
                    />
                    <TextField
                      type="number"
                      value={r.min}
                      onChange={(e) =>
                        patchRange(i, { min: Number(e.target.value) || 0 })
                      }
                      inputProps={{ step: 10000, min: 0 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">KRW</InputAdornment>
                        ),
                      }}
                      sx={{ ...numberSx, width: 170 }}
                    />
                    <Typography sx={{ fontSize: 14, color: TEXT_SECONDARY }}>
                      ≤ ~ &lt;
                    </Typography>
                    {r.unlimited ? (
                      <Box
                        sx={{
                          width: 170,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          px: 1.5,
                          border: `1.5px solid ${BORDER}`,
                          borderRadius: "10px",
                          background: SURFACE_SUNKEN,
                          color: TEXT_TERTIARY,
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        Unlimited ∞
                      </Box>
                    ) : (
                      <TextField
                        type="number"
                        value={r.max}
                        onChange={(e) =>
                          patchRange(i, { max: Number(e.target.value) || 0 })
                        }
                        inputProps={{ step: 10000, min: 0 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              KRW
                            </InputAdornment>
                          ),
                        }}
                        sx={{ ...numberSx, width: 170 }}
                      />
                    )}
                    {isLast && (
                      <Box
                        onClick={toggleLastUnlimited}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.25,
                          cursor: "pointer",
                        }}
                      >
                        <Switch size="small" checked={r.unlimited} />
                        <Typography
                          sx={{ fontSize: 12, color: TEXT_SECONDARY }}
                        >
                          No maximum limit
                        </Typography>
                      </Box>
                    )}
                    {draft.amountRanges.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeRange(i)}
                        sx={{ color: TEXT_TERTIARY, ml: "auto" }}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                );
              })}
              {draft.amountRanges.length < MAX_AMOUNT_RANGES && (
                <Button
                  onClick={addRange}
                  startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    textTransform: "none",
                    border: `1px dashed ${BRAND}`,
                    background: BRAND_SOFT,
                    color: BRAND,
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Add Range
                </Button>
              )}
            </Box>
          )}

          {draft.tmode === "all" && (
            <Note>Applies to orders containing any product.</Note>
          )}

          <Box
            sx={{
              background: SURFACE_SUNKEN,
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
              p: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                flexWrap: "wrap",
              }}
            >
              <FieldLabel hint="Target product">Purchase Quantity</FieldLabel>
              <TextField
                type="number"
                value={draft.qty}
                onChange={(e) =>
                  patch({ qty: Math.max(1, Number(e.target.value) || 1) })
                }
                inputProps={{ min: 1, max: 99 }}
                sx={numberSx}
              />
              <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY }}>
                or more
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <FieldLabel>Reward Basis</FieldLabel>
              <Segmented
                value={draft.rewardBasis}
                onChange={(rewardBasis) => patch({ rewardBasis })}
                // Packaging Benefit 은 Per product quantity 로 고정
                disabled={!isGwp}
                options={REWARD_BASIS_OPTIONS.map((o) =>
                  o.value === "per_order" ? { ...o, disabled: !isGwp } : o,
                )}
              />
              <Note>
                {!isGwp
                  ? "Packaging Benefit is always given per product quantity. Reward Basis is fixed to Per product quantity."
                  : draft.rewardBasis === "per_order"
                    ? "The reward is given once per order when the condition is met. e.g. no matter how many target products are bought, 1 set is given."
                    : "The reward is given per target product quantity. e.g. 3 target products → 3 rewards."}
              </Note>
            </Box>
          </Box>
        </SectionCard>

        <SectionCard num="3" title="Reward · Benefit">
          <Note>
            Add reward products regardless of the condition. GWP manages total /
            sold / alert quantity per reward product — quantities are entered in
            each registered promotion.
          </Note>
          {/* Reward Type — All Products 에서는 숨기고 Default Gift 로 고정 (프로모션 등록 화면과 동일) */}
          {draft.tmode !== "all" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <FieldLabel>Reward Type</FieldLabel>
              <Segmented
                value={draft.rewardType}
                onChange={(rewardType) => patch({ rewardType })}
                options={REWARD_TYPE_OPTIONS}
              />
              <Note warn={isOption}>
                {isOption
                  ? draft.tmode === "amount"
                    ? "Option Select is available on Official channels only — other channels are disabled in Multi Register. The customer picks one of the rewards of the range their order amount falls into."
                    : "Option Select is available on Official channels only — other channels are disabled in Multi Register. The customer picks one of the rewards below."
                  : draft.tmode === "amount"
                    ? "All reward products set for the matching range are given as gifts."
                    : isGwp
                      ? "All reward products below are given as gifts."
                      : "All reward products below are given as gifts. Packaging Benefit rewards are limited to Packaging-category products."}
              </Note>
            </Box>
          )}
          {draft.tmode === "amount" ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FieldLabel>Reward Products by Range</FieldLabel>
              <Note>
                Choose which products each range gives. Quantities are set once
                per SKU in each registered promotion (Shared SKU Inventory).
              </Note>
              {draft.amountRanges.map((r, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    p: "12px 14px",
                    border: `1px solid ${BORDER}`,
                    borderTop: `4px solid ${rangeColor(i)}`,
                    borderRadius: "10px",
                    background: "#fff",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`Range ${i + 1}`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        background: rangeColor(i),
                      }}
                    />
                    <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY }}>
                      {rangeText(r)}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, color: TEXT_TERTIARY, ml: "auto" }}
                    >
                      {r.rewards.length} products
                    </Typography>
                  </Box>
                  <ProductPicker
                    label="Add Reward Product"
                    value={r.rewards}
                    onChange={(rewards) => patchRange(i, { rewards })}
                    filter={rewardFilter}
                    emptyText="Search and add reward products for this range."
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <ProductPicker
              label="Add Reward Product"
              value={draft.rewards}
              onChange={(rewards) => patch({ rewards })}
              filter={rewardFilter}
              emptyText="Search and add reward products below."
            />
          )}
        </SectionCard>
      </Box>

      {/* footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 1.75,
          borderTop: `1px solid ${BORDER}`,
          background: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          {editing && onDelete && (
            <Button
              color="error"
              size="small"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => onDelete(editing)}
              sx={{ textTransform: "none", flex: "none" }}
            >
              Delete
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1, flex: "none" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!!error}
            onClick={() => onSave(normalizeDraft(draft))}
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

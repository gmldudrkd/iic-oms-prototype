"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

import {
  MOCK_BRAND_OPTIONS,
  MOCK_CHANNEL_OPTIONS,
  MOCK_CORP_OPTIONS,
  PROMOTION_TYPE_OPTIONS,
  REASON_MAX_LENGTH,
  REWARD_TYPE_OPTIONS,
  SHOW_AMOUNT_TRIGGER_TYPES,
  SHOW_EXCEPTION_PRODUCT_TYPES,
  SHOW_TRIGGER_PRODUCT_TYPES,
  TITLE_MAX_LENGTH,
  TRIGGER_TYPE_OPTIONS,
} from "../modules/constants";
import {
  PromotionDetail,
  PromotionFormValues,
  PromotionStatus,
  RewardProduct,
  TriggerType,
} from "../modules/types";
import ProductModal, { type ConditionType, type ModalItem } from "./ProductModal";
import ProductTableWithModal from "./ProductTableWithModal";
import RewardModal, { type RewardSelectedItem } from "./RewardModal";
import ReviewModal from "./ReviewModal";

// --- Shared styles ---
const LABEL_BG = "#e7e7e7";
const BORDER_COLOR = "#E0E0E0";
const LABEL_WIDTH = "180px";

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {children}
      <Typography
        component="span"
        sx={{ color: "#F44336", fontWeight: 600, fontSize: 14 }}
      >
        *
      </Typography>
    </Box>
  );
}

function FormRow({
  label,
  required,
  children,
}: {
  label: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", borderBottom: `1px solid ${BORDER_COLOR}` }}>
      <Box
        sx={{
          width: LABEL_WIDTH,
          minWidth: LABEL_WIDTH,
          backgroundColor: LABEL_BG,
          px: 2.5,
          py: 1.5,
          fontWeight: 600,
          fontSize: 14,
          color: "rgba(0,0,0,0.87)",
          display: "flex",
          alignItems: "flex-start",
          borderRight: `1px solid ${BORDER_COLOR}`,
        }}
      >
        {required ? <RequiredLabel>{label}</RequiredLabel> : label}
      </Box>
      <Box
        sx={{
          flex: 1,
          px: 2.5,
          py: 1,
          fontSize: 14,
          color: "rgba(0,0,0,0.87)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function TwoColumnFormRow({
  items,
}: {
  items: {
    label: React.ReactNode;
    required?: boolean;
    children: React.ReactNode;
  }[];
}) {
  return (
    <Box sx={{ display: "flex", borderBottom: `1px solid ${BORDER_COLOR}` }}>
      {items.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            display: "flex",
            flex: 1,
            borderRight:
              idx < items.length - 1 ? `1px solid ${BORDER_COLOR}` : "none",
          }}
        >
          <Box
            sx={{
              width: LABEL_WIDTH,
              minWidth: LABEL_WIDTH,
              backgroundColor: LABEL_BG,
              px: 2.5,
              py: 1.5,
              fontWeight: 600,
              fontSize: 14,
              color: "rgba(0,0,0,0.87)",
              display: "flex",
              alignItems: "center",
              borderRight: `1px solid ${BORDER_COLOR}`,
            }}
          >
            {item.required ? (
              <RequiredLabel>{item.label}</RequiredLabel>
            ) : (
              item.label
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              px: 2.5,
              py: 1,
              fontSize: 14,
              color: "rgba(0,0,0,0.87)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {item.children}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: 16,
        color: "rgba(0,0,0,0.87)",
        px: 2.5,
        py: 1,
        border: `1px solid ${BORDER_COLOR}`,
        mb: 0,
      }}
    >
      {title}
    </Typography>
  );
}

// --- Main Form ---
interface PromotionFormProps {
  mode: "add" | "edit";
  initialData?: PromotionDetail;
}

export default function PromotionForm({ mode, initialData }: PromotionFormProps) {
  const router = useRouter();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Product modal items state
  const [triggerModalItems, setTriggerModalItems] = useState<ModalItem[]>([]);
  const [triggerTopCond, setTriggerTopCond] = useState<ConditionType>("OR");
  const [exceptionModalItems, setExceptionModalItems] = useState<ModalItem[]>([]);
  const [exceptionTopCond, setExceptionTopCond] = useState<ConditionType>("OR");
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [rewardSelectedItems, setRewardSelectedItems] = useState<RewardSelectedItem[]>([]);
  const [isRandomReward, setIsRandomReward] = useState(false);

  const status: PromotionStatus | null = mode === "edit" && initialData ? initialData.status : null;
  const isDraft = status === "Draft";
  const isAdd = mode === "add";
  const allEditable = isAdd || isDraft;

  const defaultValues: PromotionFormValues = useMemo(() => {
    if (mode === "edit" && initialData) {
      return {
        title: initialData.title,
        type: initialData.type as PromotionFormValues["type"],
        brand: initialData.brand,
        corp: initialData.corp,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        reason: initialData.reason,
        triggerType: initialData.triggerType,
        amount: initialData.amount,
        amountCurrency: initialData.amountCurrency ?? "KRW",
        triggerChannels: initialData.triggerChannels,
        triggerProducts: initialData.triggerProducts,
        exceptionProducts: initialData.exceptionProducts ?? [],
        rewardType: initialData.rewardType,
        rewardProducts: initialData.rewardProducts,
      };
    }
    return {
      title: "", type: "", brand: "", corp: "", startDate: "", endDate: "", reason: "",
      triggerType: "", amount: null, amountCurrency: "KRW", triggerChannels: [],
      triggerProducts: [], exceptionProducts: [], rewardType: "", rewardProducts: [],
    };
  }, [mode, initialData]);

  const { control, watch, setValue, getValues } = useForm<PromotionFormValues>({ defaultValues });

  const triggerType = watch("triggerType") as TriggerType | "";
  const triggerChannels = watch("triggerChannels");
  const rewardProducts = watch("rewardProducts");

  const showAmount = triggerType !== "" && SHOW_AMOUNT_TRIGGER_TYPES.includes(triggerType as TriggerType);
  const showTriggerProduct = triggerType !== "" && SHOW_TRIGGER_PRODUCT_TYPES.includes(triggerType as TriggerType);
  const showExceptionProduct = triggerType !== "" && SHOW_EXCEPTION_PRODUCT_TYPES.includes(triggerType as TriggerType);

  useEffect(() => {
    const subscription = watch(() => setIsDirty(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  const isFieldDisabled = useCallback((field: string) => {
    if (allEditable) return false;
    return !["endDate"].includes(field);
  }, [allEditable]);

  const handleRemoveRewardProduct = useCallback((index: number) => {
    const current = getValues("rewardProducts");
    setValue("rewardProducts", current.filter((_, i) => i !== index));
  }, [getValues, setValue]);

  const handleUpdateRewardProduct = useCallback((index: number, field: string, value: number) => {
    const current = [...getValues("rewardProducts")];
    current[index] = { ...current[index], [field]: value };
    setValue("rewardProducts", current);
  }, [getValues, setValue]);

  const handleRewardModalConfirm = useCallback(
    (products: RewardSelectedItem[], random: boolean) => {
      setIsRandomReward(random);
      setRewardSelectedItems(products);
      const currentProducts = getValues("rewardProducts");
      const newRewardProducts: RewardProduct[] = products.map((p, idx) => {
        const existing = currentProducts.find((r) => r.skuCode === p.id);
        return {
          no: idx + 1,
          imageUrl: "",
          skuCode: p.id,
          productName: p.name,
          rewardQty: existing?.rewardQty ?? 1,
          stockUseDedicated: existing?.stockUseDedicated ?? null,
          stockUseRemained: existing?.stockUseRemained ?? null,
          stockUseAlertThreshold: existing?.stockUseAlertThreshold ?? null,
        };
      });
      setValue("rewardProducts", newRewardProducts);
      setRewardModalOpen(false);
    },
    [getValues, setValue],
  );

  const handleRewardReset = useCallback(() => {
    setRewardSelectedItems([]);
    setIsRandomReward(false);
    setValue("rewardProducts", []);
  }, [setValue]);

  const handleNavigateBack = useCallback(() => {
    if (isDirty) setLeaveDialogOpen(true);
    else router.back();
  }, [isDirty, router]);

  const handleLeaveConfirm = useCallback(() => {
    setLeaveDialogOpen(false);
    router.back();
  }, [router]);

  const onSaveDraft = useCallback(() => {
    router.push("/promotion/promotion-list");
  }, [router]);

  const handleReviewConfirm = useCallback(() => {
    setReviewOpen(false);
    router.push("/promotion/promotion-list");
  }, [router]);

  const formValues = watch();
  const isReviewEnabled = useMemo(() => {
    const v = formValues;
    // General
    if (!v.title || !v.type || !v.brand || !v.corp) return false;
    if (!v.startDate || !v.endDate || !v.reason) return false;
    // Trigger
    if (!v.triggerType) return false;
    if (SHOW_AMOUNT_TRIGGER_TYPES.includes(v.triggerType as TriggerType) && !v.amount) return false;
    if (v.triggerChannels.length === 0) return false;
    if (SHOW_TRIGGER_PRODUCT_TYPES.includes(v.triggerType as TriggerType) && triggerModalItems.length === 0) return false;
    // Reward
    if (!v.rewardType) return false;
    if (rewardProducts.length === 0) return false;
    // All reward products must have qty values filled
    const hasIncompleteRewardQty = rewardProducts.some(
      (p) =>
        !p.rewardQty ||
        p.rewardQty <= 0 ||
        p.stockUseDedicated == null ||
        p.stockUseAlertThreshold == null,
    );
    if (hasIncompleteRewardQty) return false;
    return true;
  }, [formValues, triggerModalItems, rewardProducts]);

  const showSaveDraft = isAdd || isDraft;

  const reviewRewardProducts = useMemo(() =>
    rewardProducts.map((p) => ({ name: p.productName, img: "🎁", qty: p.rewardQty, id: p.skuCode })),
  [rewardProducts]);

  const totalDedicated = useMemo(() => rewardProducts.reduce((sum, p) => sum + (p.stockUseDedicated ?? 0), 0), [rewardProducts]);
  const totalAlert = useMemo(() => rewardProducts.reduce((sum, p) => sum + (p.stockUseAlertThreshold ?? 0), 0), [rewardProducts]);

  return (
    <Box sx={{ px: 3, pb: 4, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <Box sx={{ py: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 20, color: "rgba(0,0,0,0.87)" }}>
          {mode === "add" ? "Add Promotion" : "Edit Promotion"}
        </Typography>
      </Box>

      {/* General */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle title="General" />
        <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderTop: "none" }}>
          <FormRow label="Title" required>
            <Controller name="title" control={control} render={({ field }) => (
              <TextField {...field} size="small" fullWidth placeholder="Promotion title" disabled={isFieldDisabled("title")} inputProps={{ maxLength: TITLE_MAX_LENGTH }}
                slotProps={{ input: { endAdornment: <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.38)", whiteSpace: "nowrap" }}>{field.value.length}/{TITLE_MAX_LENGTH}</Typography> } }}
              />
            )} />
          </FormRow>
          <TwoColumnFormRow items={[
            {
              label: "Type", required: true,
              children: <Controller name="type" control={control} render={({ field }) => (
                <FormControl size="small" fullWidth><Select {...field} displayEmpty disabled={isFieldDisabled("type")}>
                  <MenuItem value="" disabled>Please Select</MenuItem>
                  {PROMOTION_TYPE_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select></FormControl>
              )} />,
            },
            {
              label: "Reason", required: true,
              children: <Controller name="reason" control={control} render={({ field }) => (
                <TextField {...field} size="small" fullWidth placeholder="Promotion reason" disabled={isFieldDisabled("reason")} inputProps={{ maxLength: REASON_MAX_LENGTH }}
                  slotProps={{ input: { endAdornment: <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.38)", whiteSpace: "nowrap" }}>{field.value.length}/{REASON_MAX_LENGTH}</Typography> } }}
                />
              )} />,
            },
          ]} />
          {mode === "edit" && (
            <TwoColumnFormRow items={[
              { label: "Status" as React.ReactNode, children: <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.6)" }}>{status}</Typography> },
            ]} />
          )}
          <TwoColumnFormRow items={[
            {
              label: "Brand", required: true,
              children: <Controller name="brand" control={control} render={({ field }) => (
                <FormControl size="small" fullWidth><Select {...field} displayEmpty disabled={isFieldDisabled("brand")}>
                  <MenuItem value="" disabled>Please Select</MenuItem>
                  {MOCK_BRAND_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select></FormControl>
              )} />,
            },
            {
              label: "Corp", required: true,
              children: <Controller name="corp" control={control} render={({ field }) => (
                <FormControl size="small" fullWidth><Select {...field} displayEmpty disabled={isFieldDisabled("corp")}>
                  <MenuItem value="" disabled>Please Select</MenuItem>
                  {MOCK_CORP_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select></FormControl>
              )} />,
            },
          ]} />
          <TwoColumnFormRow items={[
            {
              label: "Start Date", required: true,
              children: <Controller name="startDate" control={control} render={({ field }) => (
                <TextField {...field} size="small" fullWidth disabled={isFieldDisabled("startDate")} placeholder="YYYY-MM-DD HH:mm:ss"
                  onFocus={(e) => { e.target.type = "datetime-local"; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; field.onBlur(); }}
                />
              )} />,
            },
            {
              label: "End Date", required: true,
              children: <Controller name="endDate" control={control} render={({ field }) => (
                <TextField {...field} size="small" fullWidth disabled={false} placeholder="YYYY-MM-DD HH:mm:ss"
                  onFocus={(e) => { e.target.type = "datetime-local"; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; field.onBlur(); }}
                />
              )} />,
            },
          ]} />
        </Box>
      </Box>

      {/* Trigger Detail */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle title="Trigger Detail" />
        <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderTop: "none" }}>
          {showAmount ? (
            <TwoColumnFormRow items={[
              {
                label: "Trigger Type", required: true,
                children: <Controller name="triggerType" control={control} render={({ field }) => (
                  <FormControl size="small" fullWidth><Select {...field} displayEmpty disabled={isFieldDisabled("triggerType")}>
                    <MenuItem value="" disabled>Please Select</MenuItem>
                    {TRIGGER_TYPE_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                  </Select></FormControl>
                )} />,
              },
              {
                label: "Amount", required: true,
                children: <Controller name="amount" control={control} render={({ field }) => (
                  <TextField type="number" size="small" fullWidth value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} disabled={isFieldDisabled("amount")} placeholder="0" inputProps={{ min: 0 }} />
                )} />,
              },
            ]} />
          ) : (
            <FormRow label="Trigger Type" required>
              <Controller name="triggerType" control={control} render={({ field }) => (
                <FormControl size="small" fullWidth><Select {...field} displayEmpty disabled={isFieldDisabled("triggerType")}>
                  <MenuItem value="" disabled>Please Select</MenuItem>
                  {TRIGGER_TYPE_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select></FormControl>
              )} />
            </FormRow>
          )}
          <FormRow label="Trigger Channel" required>
            <Autocomplete
              multiple size="small" fullWidth options={MOCK_CHANNEL_OPTIONS} value={triggerChannels}
              onChange={(_, newValue) => setValue("triggerChannels", newValue)}
              disabled={isFieldDisabled("triggerChannels")} disableCloseOnSelect
              renderOption={(props, option, { selected }) => <li {...props}><Checkbox size="small" checked={selected} sx={{ mr: 1 }} />{option}</li>}
              renderTags={(value, getTagProps) => value.map((option, index) => <Chip {...getTagProps({ index })} key={option + index} label={option} size="small" variant="outlined" />)}
              renderInput={(params) => <TextField {...params} placeholder={triggerChannels.length === 0 ? "Please Select" : ""} />}
            />
          </FormRow>
          {showTriggerProduct && (
            <FormRow label="Trigger Product" required>
              <ProductTableWithModal
                items={triggerModalItems} topCond={triggerTopCond}
                onChange={(items, cond) => { setTriggerModalItems(items); setTriggerTopCond(cond); }}
                disabled={isFieldDisabled("triggerProducts")} modalTitle="Add Trigger Products"
              />
            </FormRow>
          )}
          {showExceptionProduct && (
            <FormRow label="Exception Product">
              <ProductTableWithModal
                items={exceptionModalItems} topCond={exceptionTopCond}
                onChange={(items, cond) => { setExceptionModalItems(items); setExceptionTopCond(cond); }}
                disabled={isFieldDisabled("exceptionProducts")} modalTitle="Add Exception Products"
              />
            </FormRow>
          )}
        </Box>
      </Box>

      {/* Reward Detail */}
      <Box sx={{ mb: 4 }}>
        <SectionTitle title="Reward Detail" />
        <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderTop: "none" }}>
          <FormRow label="Reward Type" required>
            <Controller name="rewardType" control={control} render={({ field }) => (
              <FormControl size="small" fullWidth><Select {...field} displayEmpty disabled={isFieldDisabled("rewardType")}>
                <MenuItem value="" disabled>Please Select</MenuItem>
                {REWARD_TYPE_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </Select></FormControl>
            )} />
          </FormRow>
          <FormRow label="Reward Product" required>
            <Box sx={{ width: "100%" }}>
              {/* Random badge */}
              {isRandomReward && rewardProducts.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                  <Chip icon={<span>🎲</span>} label="Random Reward" size="small" sx={{ fontSize: 11, fontWeight: 600, color: "#4C2EC7", backgroundColor: "#F0EDFF", border: "1px solid #C4B5FD" }} />
                </Box>
              )}
              {rewardProducts.length === 0 ? (
                <Box sx={{ border: "1px dashed #E0E0E0", borderRadius: 1, backgroundColor: "#FAFAFA", py: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: "#98A2B3" }}>No products selected yet.</Typography>
                  {!isFieldDisabled("rewardProducts") && (
                    <Button startIcon={<AddIcon />} onClick={() => setRewardModalOpen(true)} sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, border: "1.5px dashed #7C5CFC", color: "#7C5CFC", backgroundColor: "#F0EDFF", "&:hover": { backgroundColor: "#E4DCFF" } }}>
                      Add Product
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderRadius: 1, backgroundColor: "#FAFAFA", overflow: "hidden" }}>
                  {/* Header */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "36px 1fr 90px 180px 36px", backgroundColor: "#e7e7e7", borderBottom: "1px solid #EAECF0", px: 1.5, py: 0.75, gap: 1, alignItems: "center" }}>
                    <Box />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>Product</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#1570EF", textTransform: "uppercase", letterSpacing: "0.04em" }}>Reward Qty</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>Stock Use Qty</Typography>
                    <Box />
                  </Box>
                  {/* Sub-header for stock columns */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "36px 1fr 90px 90px 90px 36px", backgroundColor: "#e7e7e7", borderBottom: "1px solid #EAECF0", px: 1.5, py: 0, gap: 1, alignItems: "center" }}>
                    <Box />
                    <Box />
                    <Box />
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#099250", textTransform: "uppercase", letterSpacing: "0.04em" }}>Dedicated</Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#F97316", textTransform: "uppercase", letterSpacing: "0.04em" }}>Alert</Typography>
                    <Box />
                  </Box>
                  {/* Rows */}
                  {rewardProducts.map((product, idx) => (
                    <Box key={product.skuCode + idx} sx={{ display: "grid", gridTemplateColumns: "36px 1fr 90px 90px 90px 36px", px: 1.5, py: 1, gap: 1, borderBottom: "1px solid #F2F4F7", alignItems: "center", backgroundColor: "#fff" }}>
                      <Box sx={{ fontSize: 18, textAlign: "center" }}>🎁</Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 500, color: "rgba(0,0,0,0.87)", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.productName}</Typography>
                        <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.6)", mt: 0.25 }}>{product.skuCode}</Typography>
                      </Box>
                      <Box>
                        <TextField type="number" size="small" value={product.rewardQty} onChange={(e) => handleUpdateRewardProduct(idx, "rewardQty", Number(e.target.value))} disabled={!allEditable} sx={{ width: 76, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#B2DDFF" }, "&:hover fieldset": { borderColor: "#1570EF" }, "&.Mui-focused fieldset": { borderColor: "#1570EF" } }, "& input": { textAlign: "right", fontSize: 12 } }} inputProps={{ min: 1 }} />
                      </Box>
                      <Box>
                        <TextField type="number" size="small" value={product.stockUseDedicated ?? ""} onChange={(e) => handleUpdateRewardProduct(idx, "stockUseDedicated", Number(e.target.value))} disabled={false} sx={{ width: 76, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#A9EFC5" }, "&:hover fieldset": { borderColor: "#099250" }, "&.Mui-focused fieldset": { borderColor: "#099250" } }, "& input": { textAlign: "right", fontSize: 12 } }} inputProps={{ min: 0 }} />
                      </Box>
                      <Box>
                        <TextField type="number" size="small" value={product.stockUseAlertThreshold ?? ""} onChange={(e) => handleUpdateRewardProduct(idx, "stockUseAlertThreshold", Number(e.target.value))} disabled={false} sx={{ width: 76, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FED7AA" }, "&:hover fieldset": { borderColor: "#F97316" }, "&.Mui-focused fieldset": { borderColor: "#F97316" } }, "& input": { textAlign: "right", fontSize: 12 } }} inputProps={{ min: 0 }} />
                      </Box>
                      <Box>
                        {allEditable && (
                          <IconButton size="small" onClick={() => {
                            handleRemoveRewardProduct(idx);
                            setRewardSelectedItems((prev) => prev.filter((s) => s.id !== product.skuCode));
                          }} sx={{ color: "#98A2B3" }}>
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  ))}
                  {/* Footer */}
                  <Box sx={{ px: 1.5, py: 1, borderTop: "1px solid #F2F4F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 11, color: "#98A2B3" }}>{rewardProducts.length} product{rewardProducts.length > 1 ? "s" : ""} selected</Typography>
                    {allEditable && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button size="small" onClick={handleRewardReset} sx={{ fontSize: 12, fontWeight: 600, textTransform: "none", border: "1.5px solid #F04438", color: "#F04438", backgroundColor: "#FFF1F0", "&:hover": { backgroundColor: "#FFE4E1" } }}>
                          Reset
                        </Button>
                        <Button size="small" startIcon={<AddIcon />} onClick={() => setRewardModalOpen(true)} sx={{ fontSize: 12, fontWeight: 600, textTransform: "none", border: "1.5px dashed #7C5CFC", color: "#7C5CFC", backgroundColor: "#F0EDFF", "&:hover": { backgroundColor: "#E4DCFF" } }}>
                          Add Product
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </FormRow>
        </Box>
      </Box>

      {/* Reward Modal */}
      <RewardModal
        open={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        onConfirm={handleRewardModalConfirm}
        initialSelected={rewardSelectedItems}
        initialRandom={isRandomReward}
      />

      {/* Bottom Actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, borderTop: `1px solid ${BORDER_COLOR}`, pt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={handleNavigateBack}>Cancel</Button>
        {showSaveDraft && <Button variant="outlined" color="primary" onClick={onSaveDraft}>Save as Draft</Button>}
        <Button variant="contained" color="primary" disabled={!isReviewEnabled} onClick={() => setReviewOpen(true)}>Review</Button>
      </Box>

      {/* Leave Page Dialog */}
      <AlertDialog open={leaveDialogOpen} setOpen={setLeaveDialogOpen} isButton={false}
        dialogContent="The promotion has not been submitted and was not created. Are you sure you want to leave this page?"
        dialogCloseLabel="Cancel" dialogConfirmLabel="Leave" handlePost={handleLeaveConfirm}
      />

      {/* Review Modal */}
      <ReviewModal
        open={reviewOpen} onClose={() => setReviewOpen(false)} onConfirm={handleReviewConfirm}
        formData={{ type: formValues.type || "", brand: formValues.brand || "", corp: formValues.corp || "", startDate: formValues.startDate || "", endDate: formValues.endDate || "", triggerType: formValues.triggerType || "" }}
        triggerItems={triggerModalItems} triggerTopCond={triggerTopCond}
        exceptionItems={exceptionModalItems} exceptionTopCond={exceptionTopCond}
        rewardProducts={reviewRewardProducts} totalDedicated={totalDedicated} totalAlert={totalAlert}
      />
    </Box>
  );
}

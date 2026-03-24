"use client";

import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

import { getMockPromotionDetail } from "./modules/mockData";
import { PromotionDetail as PromotionDetailType } from "./modules/types";

const statusColorMap: Record<
  string,
  "success" | "warning" | "error" | "default"
> = {
  Active: "success",
  Upcoming: "warning",
  Expired: "default",
  Draft: "default",
};

const statusSxMap: Record<string, object> = {
  Expired: { backgroundColor: "#9E9E9E", color: "#FFFFFF" },
  Draft: { backgroundColor: "#42A5F5", color: "#FFFFFF" },
};

const TRIGGER_TYPE_LABELS: Record<string, string> = {
  "Purchase Over Amount Threshold": "Purchase Over Amount Threshold",
  "Purchase Specific Product or Label": "Specific Products are purchased",
  "Purchase Specific Product Over Amount Threshold":
    "Specific Products over Amount Threshold",
  "Purchase Any Product": "Purchase Any Product",
};

const SHOW_AMOUNT_TYPES = [
  "Purchase Over Amount Threshold",
  "Purchase Specific Product Over Amount Threshold",
];

const SHOW_TRIGGER_PRODUCT_TYPES = [
  "Purchase Specific Product or Label",
  "Purchase Specific Product Over Amount Threshold",
];

// --- Shared styles ---
const LABEL_BG = "#e7e7e7";
const BORDER_COLOR = "#E0E0E0";
const LABEL_WIDTH = "180px";

function LabelValueRow({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
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
        {label}
      </Box>
      <Box
        sx={{
          flex: 1,
          px: 2.5,
          py: 1.5,
          fontSize: 14,
          color: "rgba(0,0,0,0.87)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

function TwoColumnRow({
  items,
}: {
  items: { label: React.ReactNode; value: React.ReactNode }[];
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
              idx < items.length - 1
                ? `1px solid ${BORDER_COLOR}`
                : "none",
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
            {item.label}
          </Box>
          <Box
            sx={{
              flex: 1,
              px: 2.5,
              py: 1.5,
              fontSize: 14,
              color: "rgba(0,0,0,0.87)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {item.value}
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

interface PromotionDetailProps {
  promotionId: string;
}

export default function PromotionDetail({
  promotionId,
}: PromotionDetailProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const detail: PromotionDetailType | undefined =
    getMockPromotionDetail(promotionId);

  const canDelete =
    detail?.status === "Draft" || detail?.status === "Upcoming";

  const handleDelete = useCallback(() => {
    // Mock: 실제로는 API 호출
    setDeleteDialogOpen(false);
    setDeleteConfirmText("");
    router.push("/promotion/promotion-list");
  }, [router]);

  if (!detail) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>프로모션 정보를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const showAmount = SHOW_AMOUNT_TYPES.includes(detail.triggerType);
  const showTriggerProduct = SHOW_TRIGGER_PRODUCT_TYPES.includes(
    detail.triggerType,
  );

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (amount == null) return "-";
    return `${amount.toLocaleString()} ${currency ?? ""}`;
  };

  return (
    <Box sx={{ px: 3, pb: 4, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 20, color: "rgba(0,0,0,0.87)" }}>
            #{detail.promotionNo} {detail.title}
          </Typography>
          <Chip
            label={detail.status}
            color={statusColorMap[detail.status] ?? "default"}
            size="small"
            sx={statusSxMap[detail.status]}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              router.push(
                `/promotion/promotion-list/edit/${detail.promotionNo}`,
              )
            }
          >
            Edit
          </Button>
          {canDelete && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      {/* General */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle title="General" />
        <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderTop: "none" }}>
          <TwoColumnRow
            items={[
              { label: "Type", value: detail.type },
              {
                label: "Status",
                value: (
                  <Chip
                    label={detail.status}
                    color={statusColorMap[detail.status] ?? "default"}
                    size="small"
                    sx={statusSxMap[detail.status]}
                  />
                ),
              },
            ]}
          />
          <TwoColumnRow
            items={[
              { label: "Brand", value: detail.brand },
              { label: "Corp", value: detail.corp },
            ]}
          />
          <TwoColumnRow
            items={[
              { label: "Start Date", value: detail.startDate },
              { label: "End Date", value: detail.endDate },
            ]}
          />
          <TwoColumnRow
            items={[
              { label: "Created By", value: detail.createdBy },
              { label: "Reason", value: detail.reason },
            ]}
          />
        </Box>
      </Box>

      {/* Trigger Detail */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle title="Trigger Detail" />
        <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderTop: "none" }}>
          {showAmount ? (
            <TwoColumnRow
              items={[
                {
                  label: "Trigger Type",
                  value:
                    TRIGGER_TYPE_LABELS[detail.triggerType] ??
                    detail.triggerType,
                },
                {
                  label: "Amount",
                  value: formatAmount(detail.amount, detail.amountCurrency),
                },
              ]}
            />
          ) : (
            <LabelValueRow
              label="Trigger Type"
              value={
                TRIGGER_TYPE_LABELS[detail.triggerType] ?? detail.triggerType
              }
            />
          )}
          <LabelValueRow
            label="Trigger Channel"
            value={
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {detail.triggerChannels.map((channel, idx) => (
                  <Chip key={idx} label={channel} size="small" variant="outlined" />
                ))}
              </Box>
            }
          />
          {showTriggerProduct && detail.triggerProducts.length > 0 && (
            <LabelValueRow
              label="Trigger Product"
              value={
                <TableContainer sx={{ border: `1px solid ${BORDER_COLOR}` }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: LABEL_BG }}>
                        <TableCell sx={{ fontWeight: 600, width: 50, color: "rgba(0,0,0,0.87)" }}>
                          No.
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 60, color: "rgba(0,0,0,0.87)" }}>
                          Image
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>
                          SKU Code
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>
                          Product Name
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail.triggerProducts.map((product) => (
                        <TableRow key={product.no}>
                          <TableCell sx={{ color: "rgba(0,0,0,0.87)" }}>
                            {product.no}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: "#E0E0E0",
                                borderRadius: 0.5,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: "rgba(0,0,0,0.87)" }}>
                            {product.skuCode}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "rgba(0,0,0,0.87)",
                              maxWidth: 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.productName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            />
          )}
        </Box>
      </Box>

      {/* Reward Detail */}
      <Box>
        <SectionTitle title="Reward Detail" />
        <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderTop: "none" }}>
          <LabelValueRow label="Reward Type" value={detail.rewardType} />
          <LabelValueRow
            label={
              <Box sx={{ display: "flex", gap: 0.5 }}>
                Reward Product
                <Typography
                  component="span"
                  sx={{ color: "#F44336", fontWeight: 600, fontSize: 14 }}
                >
                  *
                </Typography>
              </Box>
            }
            value={
              <TableContainer sx={{ border: `1px solid ${BORDER_COLOR}` }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: LABEL_BG }}>
                      <TableCell sx={{ fontWeight: 600, width: 50, color: "rgba(0,0,0,0.87)" }}>
                        No.
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 60, color: "rgba(0,0,0,0.87)" }}>
                        Image
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>
                        SKU Code
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>
                        Product Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          textAlign: "right",
                          color: "rgba(0,0,0,0.87)",
                        }}
                      >
                        Reward Qty
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          textAlign: "left",
                          color: "rgba(0,0,0,0.87)",
                          borderBottom: "none",
                        }}
                        colSpan={3}
                      >
                        Stock Use Qty
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: LABEL_BG }}>
                      <TableCell colSpan={5} sx={{ borderBottom: "none", p: 0 }} />
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          textAlign: "left",
                          fontSize: 12,
                          color: "rgba(0,0,0,0.6)",
                          pt: 0,
                        }}
                      >
                        Dedicated
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          textAlign: "left",
                          fontSize: 12,
                          color: "rgba(0,0,0,0.6)",
                          pt: 0,
                        }}
                      >
                        Remained
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          textAlign: "left",
                          fontSize: 12,
                          color: "rgba(0,0,0,0.6)",
                          pt: 0,
                        }}
                      >
                        Alert
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detail.rewardProducts.map((product) => (
                      <TableRow key={product.no}>
                        <TableCell sx={{ color: "rgba(0,0,0,0.87)" }}>
                          {product.no}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              backgroundColor: "#E0E0E0",
                              borderRadius: 0.5,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "rgba(0,0,0,0.87)" }}>
                          {product.skuCode}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(0,0,0,0.87)" }}>
                          {product.productName}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right", color: "rgba(0,0,0,0.87)" }}>
                          {product.rewardQty}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", color: "rgba(0,0,0,0.87)" }}>
                          {product.stockUseDedicated ?? "–"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", color: "rgba(0,0,0,0.87)" }}>
                          {product.stockUseRemained ?? "–"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", color: "rgba(0,0,0,0.87)" }}>
                          {product.stockUseAlertThreshold ?? "–"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            }
          />
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        setOpen={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteConfirmText("");
        }}
        isButton={false}
        dialogTitle="Delete Promotion"
        dialogContent={
          <Box sx={{ pt: 1 }}>
            <Typography sx={{ fontSize: 14, mb: 2 }}>
              Delete this promotion? This action is permanent and cannot be
              undone. All related settings and data will be removed. Type{" "}
              <strong>delete</strong> to confirm.
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Type delete to confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
          </Box>
        }
        dialogCloseLabel="Cancel"
        dialogConfirmLabel="Delete"
        handlePost={handleDelete}
        postButtonProps={{
          disabled: deleteConfirmText !== "delete",
        }}
      />
    </Box>
  );
}

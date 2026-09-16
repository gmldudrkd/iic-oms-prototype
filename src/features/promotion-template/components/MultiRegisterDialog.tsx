"use client";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ChannelDot,
  DraftBadge,
  EmptyHint,
  FieldLabel,
} from "@/features/promotion-template/components/atoms";
import {
  BORDER,
  BORDER_STRONG,
  BRAND,
  BRAND_SOFT,
  DANGER,
  SURFACE_SUNKEN,
  TEMPLATE_TYPE_LABEL,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  WARNING,
  WARNING_BG,
  isOfficialChannel,
} from "@/features/promotion-template/modules/constants";
import {
  MultiRegisterRow,
  PromotionTemplate,
} from "@/features/promotion-template/modules/types";
import {
  channelColor,
  conditionDesc,
  defaultEnd,
  defaultStart,
  fmtLocal,
  nextRoundName,
  rewardDesc,
  targetDesc,
  validateRows,
} from "@/features/promotion-template/modules/utils";

interface Props {
  open: boolean;
  template: PromotionTemplate | null;
  channels: string[];
  onClose: () => void;
  onRegister: (rows: MultiRegisterRow[]) => void;
}

let rowSeq = 0;

const cellInputSx = {
  "& .MuiInputBase-root": { fontSize: 13, background: "#fff" },
  "& input": { py: "6px", px: "8px" },
};
// datetime-local 입력은 폭을 고정해 표가 다이얼로그 안에 들어오게 한다
const dateInputSx = { ...cellInputSx, width: 178 };

// 멀티 등록 — 채널을 여러 개 고르고 채널별 기간만 입력하면 채널 수만큼 DRAFT 프로모션이 생성된다
export default function MultiRegisterDialog({
  open,
  template: t,
  channels,
  onClose,
  onRegister,
}: Props) {
  const [rows, setRows] = useState<MultiRegisterRow[]>([]);

  useEffect(() => {
    if (open) setRows([]);
  }, [open, t]);

  const isPkg = t?.type === "PACKAGE";
  const optOnly = t?.rewardType === "option";

  const addRow = useCallback(
    (channel: string, after?: MultiRegisterRow) => {
      if (!t) return;
      const row: MultiRegisterRow = after
        ? { ...after, key: `r${++rowSeq}`, name: nextRoundName(after.name) }
        : {
            key: `r${++rowSeq}`,
            channel,
            name: `${t.name} · ${channel}`,
            start: defaultStart(),
            end: defaultEnd(),
            always: false,
          };
      setRows((prev) => {
        if (!after) return [...prev, row];
        const i = prev.findIndex((r) => r.key === after.key);
        const next = [...prev];
        next.splice(i + 1, 0, row);
        return next;
      });
    },
    [t],
  );

  const toggleChannel = (channel: string, on: boolean) => {
    if (on) addRow(channel);
    else setRows((prev) => prev.filter((r) => r.channel !== channel));
  };

  const patchRow = (key: string, p: Partial<MultiRegisterRow>) =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== key) return r;
        const next = { ...r, ...p };
        if (p.always) next.end = "";
        return next;
      }),
    );

  const removeRow = (key: string) =>
    setRows((prev) => prev.filter((r) => r.key !== key));

  const error = useMemo(() => validateRows(rows), [rows]);

  if (!t) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: { borderRadius: "12px", maxHeight: "92vh", maxWidth: 1040 },
      }}
    >
      {/* header */}
      <Box
        sx={{ px: 3, pt: 2.25, pb: 1.5, borderBottom: `1px solid ${BORDER}` }}
      >
        <Typography
          sx={{
            fontSize: 12,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: TEXT_TERTIARY,
            fontWeight: 500,
          }}
        >
          Multi Register
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{t.name}</Typography>
      </Box>

      {/* body */}
      <Box
        sx={{
          px: 3,
          py: 2,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 1.75,
        }}
      >
        {/* summary */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1.25,
            fontSize: 12.5,
            color: TEXT_PRIMARY,
          }}
        >
          {[
            ["Type", TEMPLATE_TYPE_LABEL[t.type]],
            ["Target", targetDesc(t)],
            ["Condition", conditionDesc(t)],
            [
              "Reward",
              `${t.rewardType === "option" ? "Option Select · " : ""}${rewardDesc(t)}`,
            ],
          ].map(([k, v]) => (
            <Box key={k}>
              <Typography sx={{ fontSize: 11.5, color: TEXT_TERTIARY }}>
                {k}
              </Typography>
              <Typography sx={{ fontSize: 12.5 }}>{v}</Typography>
            </Box>
          ))}
        </Box>

        {/* notice */}
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "flex-start",
            background: WARNING_BG,
            borderRadius: "8px",
            px: 1.75,
            py: 1.25,
            fontSize: 13,
          }}
        >
          <Box sx={{ mt: "2px" }}>
            <DraftBadge />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: WARNING }}>
              All promotions created by Multi Register are saved as DRAFT.
            </Typography>
            <Typography sx={{ fontSize: 13, color: TEXT_PRIMARY }}>
              {isPkg
                ? "One promotion is created per channel. Review and activate each promotion to apply it."
                : "One promotion is created per channel. Enter reward quantity and activate each promotion to apply it."}
            </Typography>
          </Box>
        </Box>

        {/* channels */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <FieldLabel
            hint={
              optOnly
                ? "Option Select templates are available on Official channels only — other channels cannot be selected."
                : isPkg
                  ? "One promotion is created per checked channel."
                  : "One promotion is created per checked channel (GWP: 1 per channel). Reward quantity is managed in each created promotion."
            }
          >
            Channels
          </FieldLabel>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {channels.map((ch) => {
              const off = optOnly && !isOfficialChannel(ch);
              const on = rows.some((r) => r.channel === ch);
              const c = channelColor(channels, ch);
              return (
                <FormControlLabel
                  key={ch}
                  title={off ? "Option Select is Official-channel only" : ""}
                  disabled={off}
                  control={
                    <Checkbox
                      size="small"
                      checked={on}
                      onChange={(e) => toggleChannel(ch, e.target.checked)}
                      sx={{ p: 0.5 }}
                    />
                  }
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <ChannelDot color={c.color} />
                      <Typography sx={{ fontSize: 13 }}>{ch}</Typography>
                    </Box>
                  }
                  sx={{
                    m: 0,
                    pr: 1.5,
                    pl: 0.5,
                    py: 0.25,
                    border: `1px solid ${on ? BRAND : BORDER_STRONG}`,
                    background: on ? BRAND_SOFT : "#fff",
                    borderRadius: "6px",
                    opacity: off ? 0.45 : 1,
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {rows.length === 0 ? (
          <EmptyHint text="Select channels." />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table
              size="small"
              sx={{
                "& th": {
                  fontWeight: 500,
                  color: TEXT_TERTIARY,
                  whiteSpace: "nowrap",
                  borderBottom: `1px solid ${BORDER}`,
                  px: 1,
                },
                "& td": {
                  px: 1,
                  py: 0.75,
                  borderBottom: `1px solid ${BORDER}`,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Channel</TableCell>
                  <TableCell>Promotion Name</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => {
                  const c = channelColor(channels, r.channel);
                  return (
                    <TableRow key={r.key}>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <ChannelDot color={c.color} />
                          {r.channel}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ minWidth: 180 }}>
                        <TextField
                          size="small"
                          fullWidth
                          value={r.name}
                          onChange={(e) =>
                            patchRow(r.key, { name: e.target.value })
                          }
                          sx={cellInputSx}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="datetime-local"
                          value={r.start}
                          onChange={(e) =>
                            patchRow(r.key, { start: e.target.value })
                          }
                          sx={dateInputSx}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="datetime-local"
                          value={r.end}
                          disabled={r.always}
                          onChange={(e) =>
                            patchRow(r.key, { end: e.target.value })
                          }
                          sx={dateInputSx}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <FormControlLabel
                          sx={{
                            m: 0,
                            "& .MuiTypography-root": { fontSize: 12 },
                          }}
                          control={
                            <Checkbox
                              size="small"
                              checked={r.always}
                              onChange={(e) =>
                                patchRow(r.key, { always: e.target.checked })
                              }
                              sx={{
                                p: 0.5,
                                color: WARNING,
                                "&.Mui-checked": { color: WARNING },
                              }}
                            />
                          }
                          label="Always on"
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Button
                          size="small"
                          onClick={() => addRow(r.channel, r)}
                          title="Add another period on the same channel (e.g. round 1 · round 2)"
                          sx={{
                            textTransform: "none",
                            fontSize: 12,
                            minWidth: 0,
                            px: 1,
                          }}
                        >
                          + Period
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeRow(r.key)}
                          sx={{
                            textTransform: "none",
                            fontSize: 12,
                            minWidth: 0,
                            px: 1,
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* preview */}
        {rows.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <FieldLabel>
                Promotions to create{" "}
                <Typography
                  component="span"
                  sx={{ fontFamily: "ui-monospace, Menlo, monospace" }}
                >
                  {rows.length}
                </Typography>
              </FieldLabel>
              <Typography sx={{ fontSize: 12, color: TEXT_TERTIARY }}>
                1 channel = 1 promotion · all DRAFT
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 1,
              }}
            >
              {rows.map((r, i) => {
                const c = channelColor(channels, r.channel);
                return (
                  <Box
                    key={r.key}
                    sx={{
                      position: "relative",
                      border: `1px dashed ${BORDER_STRONG}`,
                      borderRadius: "8px",
                      p: "10px 12px",
                      background: SURFACE_SUNKEN,
                      fontSize: 12.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 10,
                        fontSize: 11,
                        color: TEXT_TERTIARY,
                        fontFamily: "ui-monospace, Menlo, monospace",
                      }}
                    >
                      #{i + 1}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        fontWeight: 600,
                        color: c.color,
                      }}
                    >
                      <ChannelDot color={c.color} />
                      {r.channel}
                    </Box>
                    <Typography
                      sx={{ fontSize: 12.5, pr: 3, lineHeight: 1.35 }}
                    >
                      {r.name || "(Promotion Name)"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: TEXT_TERTIARY,
                        fontFamily: "ui-monospace, Menlo, monospace",
                      }}
                    >
                      {r.always
                        ? `${r.start ? `${fmtLocal(r.start)} ~ ` : ""}Always on`
                        : `${fmtLocal(r.start) || "—"} → ${fmtLocal(r.end) || "—"}`}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        color: TEXT_TERTIARY,
                      }}
                    >
                      <DraftBadge />
                      {!isPkg && <span>Reward Qty not set</span>}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* footer */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            color: error && rows.length > 0 ? DANGER : TEXT_SECONDARY,
          }}
        >
          {error ||
            (isPkg
              ? `${rows.length} promotions will be created as DRAFT`
              : `${rows.length} promotions will be created as DRAFT · enter reward quantity in each promotion afterwards`)}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
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
            onClick={() => onRegister(rows)}
            sx={{ textTransform: "none" }}
          >
            {rows.length
              ? `Register ${rows.length} promotions as DRAFT`
              : "Register"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

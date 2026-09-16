"use client";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { Note } from "@/features/promotion-template/components/atoms";
import {
  BORDER,
  BORDER_STRONG,
  BRAND,
  PRODUCTS,
  SEARCH_FIELD_OPTIONS,
  SEARCH_RESULT_LIMIT,
  SUCCESS,
  SURFACE_ALT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
} from "@/features/promotion-template/modules/constants";
import { TemplateProduct } from "@/features/promotion-template/modules/types";
import { productName } from "@/features/promotion-template/modules/utils";

type SearchField = (typeof SEARCH_FIELD_OPTIONS)[number]["value"];

interface Props {
  label: string;
  // 선택된 SKU 목록 (SAP 코드)
  value: string[];
  onChange: (next: string[]) => void;
  // 검색 대상 제품 필터 (Target / Reward 구분)
  filter: (p: TemplateProduct) => boolean;
  emptyText: string;
}

const fieldValue = (p: TemplateProduct, f: SearchField) =>
  f === "sap" ? p.sap : f === "name" ? p.name : p.model;

// 제품 검색·추가 블록 — 선택 칩 + (검색 기준 · 복수 키워드) + 결과 목록
export default function ProductPicker({
  label,
  value,
  onChange,
  filter,
  emptyText,
}: Props) {
  const [field, setField] = useState<SearchField>("sap");
  const [query, setQuery] = useState("");

  const found = useMemo(() => {
    const kws = query
      .split("\n")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const pool = PRODUCTS.filter(filter);
    if (kws.length === 0) return pool;
    return pool.filter((p) =>
      kws.some((k) => fieldValue(p, field).toLowerCase().includes(k)),
    );
  }, [query, field, filter]);

  const add = (sap: string) => {
    if (!value.includes(sap)) onChange([...value, sap]);
  };
  const addAll = () => {
    const next = [...value];
    found.forEach((p) => {
      if (!next.includes(p.sap)) next.push(p.sap);
    });
    onChange(next);
  };
  const remove = (sap: string) => onChange(value.filter((s) => s !== sap));

  const shown = found.slice(0, SEARCH_RESULT_LIMIT);
  const rest = found.length - shown.length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* picked */}
      <Box
        sx={{
          minHeight: 46,
          border: `1px dashed ${BORDER_STRONG}`,
          borderRadius: "8px",
          p: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 0.75,
          alignItems: "center",
        }}
      >
        {value.length === 0 ? (
          <Typography
            sx={{
              width: "100%",
              textAlign: "center",
              fontSize: 12.5,
              color: TEXT_TERTIARY,
            }}
          >
            {emptyText}
          </Typography>
        ) : (
          value.map((sap) => (
            <Box
              key={sap}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                background: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: "6px",
                pl: 1.1,
                pr: 0.25,
                py: 0.25,
                fontSize: 12,
                color: TEXT_PRIMARY,
              }}
            >
              {productName(sap)}
              <Typography
                component="span"
                sx={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 11,
                  color: TEXT_TERTIARY,
                }}
              >
                {sap}
              </Typography>
              <IconButton
                size="small"
                onClick={() => remove(sap)}
                sx={{ p: 0.25, color: TEXT_TERTIARY }}
                aria-label="remove"
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      {/* search */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          p: "14px 16px",
          background: SURFACE_ALT,
          border: `1px solid ${BORDER}`,
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {label}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={addAll}
              disabled={found.length === 0}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              + Select all ({found.length})
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onChange([])}
              disabled={value.length === 0}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              Remove all ({value.length})
            </Button>
          </Box>
        </Box>
        <Note>
          Linked to product DB · searching a model code shows all products under
          that model.
        </Note>
        <Box sx={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 1 }}>
          <Select
            size="small"
            value={field}
            onChange={(e) => setField(e.target.value as SearchField)}
            sx={{ background: "#fff", fontSize: 13 }}
          >
            {SEARCH_FIELD_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            multiline
            minRows={1}
            maxRows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter multiple keywords separated by line breaks"
            sx={{
              "& .MuiInputBase-root": { background: "#fff", fontSize: 13 },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            maxHeight: 230,
            overflow: "auto",
          }}
        >
          {shown.map((p) => {
            const on = value.includes(p.sap);
            return (
              <Box
                key={p.sap}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "8px",
                  px: 1.5,
                  py: 0.75,
                  opacity: on ? 0.5 : 1,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}
                    noWrap
                  >
                    {p.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      color: TEXT_TERTIARY,
                      fontFamily: "ui-monospace, Menlo, monospace",
                    }}
                  >
                    {p.sap} · {p.model} · {p.category}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: 12.5, color: TEXT_SECONDARY }}>
                    {p.price ? `KRW ${p.price.toLocaleString()}` : p.category}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => add(p.sap)}
                    disabled={on}
                    aria-label={on ? "added" : "add"}
                    sx={{ color: on ? SUCCESS : BRAND }}
                  >
                    {on ? (
                      <CheckIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <AddIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
        <Typography
          sx={{ fontSize: 12, color: TEXT_TERTIARY, textAlign: "center" }}
        >
          {found.length === 0
            ? "No products found."
            : rest > 0
              ? `${rest} more · use [Select all] to add at once`
              : ""}
        </Typography>
      </Box>
    </Box>
  );
}

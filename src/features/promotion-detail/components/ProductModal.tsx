"use client";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

// --- Types ---
export interface ModalProduct {
  id: string;
  sap: string;
  label: string;
  name: string;
  category: string;
  img: string;
}

export interface ModalProductItem {
  type: "product";
  uid: number;
  id: string;
  sap: string;
  label: string;
  name: string;
  category: string;
  img: string;
}

export interface ModalGroupItem {
  type: "group";
  id: string;
  name: string;
  condition: "AND" | "OR";
  products: ModalProduct[];
  color: GroupColor;
}

export type ModalItem = ModalProductItem | ModalGroupItem;
export type ConditionType = "AND" | "OR";

interface GroupColor {
  bg: string;
  border: string;
  text: string;
  badge: string;
}

// --- Constants ---
const PRODUCTS: ModalProduct[] = [
  { id: "B0000001", sap: "SAP-10021", label: "RIBBON", name: "SHRY 240ml BLACK RIBBON_23", category: "Beverage", img: "🧃" },
  { id: "S0000003", sap: "SAP-10022", label: "GOLD", name: "SHRY 500ml GOLD EDITION", category: "Beverage", img: "🧴" },
  { id: "C0000012", sap: "SAP-20011", label: "GIFT", name: "Premium Gift Box Set A", category: "Gift Set", img: "🎁" },
  { id: "C0000013", sap: "SAP-20012", label: "GIFT", name: "Premium Gift Box Set B", category: "Gift Set", img: "🎀" },
  { id: "D0000021", sap: "SAP-10023", label: "MINI", name: "SHRY 120ml MINI PACK", category: "Beverage", img: "🥤" },
  { id: "E0000005", sap: "SAP-30001", label: "TEA", name: "Organic Green Tea 30T", category: "Tea/Coffee", img: "🍵" },
  { id: "E0000006", sap: "SAP-30002", label: "TEA", name: "Premium Black Tea 20T", category: "Tea/Coffee", img: "☕" },
  { id: "F0000030", sap: "SAP-40001", label: "HEALTH", name: "Wellness Supplement Pack", category: "Health Food", img: "💊" },
];

const GROUP_COLORS: GroupColor[] = [
  { bg: "#F0EDFF", border: "#7C5CFC", text: "#4C2EC7", badge: "#E0D9FF" },
  { bg: "#ECFDF5", border: "#10B981", text: "#065F46", badge: "#A7F3D0" },
  { bg: "#FFF7ED", border: "#F97316", text: "#9A3412", badge: "#FED7AA" },
  { bg: "#FFF1F2", border: "#FB7185", text: "#9F1239", badge: "#FECDD3" },
];

const SEARCH_TYPES = ["SKU Code", "SAP Code", "Label", "Product Name"] as const;

let uidCounter = 1;
let gidCounter = 1;

function ConditionBadge({ type, size = "small" }: { type: ConditionType; size?: "small" | "medium" }) {
  const isAnd = type === "AND";
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        height: size === "small" ? 20 : 24,
        fontSize: size === "small" ? 10 : 11,
        fontWeight: 700,
        backgroundColor: isAnd ? "#EFF8FF" : "#ECFDF3",
        color: isAnd ? "#1570EF" : "#099250",
        border: `1px solid ${isAnd ? "#B2DDFF" : "#A9EFC5"}`,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

// --- ProductModal ---
interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (items: ModalItem[], topCond: ConditionType) => void;
  initialItems?: ModalItem[];
  initialTopCond?: ConditionType;
  title?: string;
}

export default function ProductModal({
  open,
  onClose,
  onConfirm,
  initialItems = [],
  initialTopCond = "OR",
  title = "Add Products",
}: ProductModalProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<(typeof SEARCH_TYPES)[number]>("SKU Code");
  const [items, setItems] = useState<ModalItem[]>(initialItems);
  const [topCond, setTopCond] = useState<ConditionType>(initialTopCond);
  const [checkedUids, setCheckedUids] = useState<Set<number>>(new Set());
  const [groupMode, setGroupMode] = useState(false);

  // Sync internal state when modal opens with new initialItems
  useEffect(() => {
    if (open) {
      setItems(initialItems);
      setTopCond(initialTopCond);
      setQuery("");
      setCheckedUids(new Set());
      setGroupMode(false);
    }
  }, [open, initialItems, initialTopCond]);

  const allProductIds = items.flatMap((i) =>
    i.type === "group" ? i.products.map((p) => p.id) : [i.id],
  );

  const filtered = PRODUCTS.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (searchType === "SKU Code") return p.id.toLowerCase().includes(q);
    if (searchType === "SAP Code") return p.sap.toLowerCase().includes(q);
    if (searchType === "Label") return p.label.toLowerCase().includes(q);
    if (searchType === "Product Name") return p.name.toLowerCase().includes(q);
    return true;
  });

  const addProduct = useCallback((p: ModalProduct) => {
    setItems((prev) => [...prev, { type: "product", uid: uidCounter++, ...p }]);
  }, []);

  const removeItem = useCallback((idx: number) => {
    setItems((prev) => {
      const item = prev[idx];
      if (item.type === "group") {
        return [
          ...prev.slice(0, idx),
          ...item.products.map((p) => ({ type: "product" as const, uid: uidCounter++, ...p })),
          ...prev.slice(idx + 1),
        ];
      }
      return prev.filter((_, i) => i !== idx);
    });
    setCheckedUids(new Set());
  }, []);

  const removeProductFromGroup = useCallback((gi: number, pid: string) => {
    setItems((prev) => {
      const updated = [...prev];
      const g = { ...updated[gi] } as ModalGroupItem;
      g.products = g.products.filter((p) => p.id !== pid);
      if (g.products.length <= 1) {
        updated.splice(
          gi,
          1,
          ...g.products.map((p) => ({ type: "product" as const, uid: uidCounter++, ...p })),
        );
      } else {
        updated[gi] = g;
      }
      return updated;
    });
  }, []);

  const toggleCheck = useCallback((u: number) => {
    setCheckedUids((prev) => {
      const next = new Set(prev);
      next.has(u) ? next.delete(u) : next.add(u);
      return next;
    });
  }, []);

  const makeGroup = useCallback(() => {
    if (checkedUids.size < 2) return;
    const color = GROUP_COLORS[gidCounter % GROUP_COLORS.length];
    const groupName = `Group ${String.fromCharCode(64 + gidCounter)}`;
    gidCounter++;
    const groupProducts = items.filter(
      (i): i is ModalProductItem => i.type === "product" && checkedUids.has(i.uid),
    );
    const group: ModalGroupItem = {
      type: "group",
      id: `g${gidCounter}`,
      name: groupName,
      condition: "OR",
      products: groupProducts.map(({ id, sap, label, name, img, category }) => ({
        id,
        sap,
        label,
        name,
        img,
        category: category ?? "",
      })),
      color,
    };
    setItems((prev) => {
      const remaining = prev.filter(
        (i) => i.type !== "product" || !checkedUids.has((i as ModalProductItem).uid),
      );
      const firstIdx = prev.findIndex(
        (i) => i.type === "product" && checkedUids.has((i as ModalProductItem).uid),
      );
      return [...remaining.slice(0, firstIdx), group, ...remaining.slice(firstIdx)];
    });
    setCheckedUids(new Set());
    setGroupMode(false);
  }, [checkedUids, items]);

  const toggleGroupCond = useCallback((idx: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx && item.type === "group"
          ? { ...item, condition: item.condition === "AND" ? "OR" : "AND" }
          : item,
      ),
    );
  }, []);

  const individualItems = items.filter((i): i is ModalProductItem => i.type === "product");
  const checkedCount = checkedUids.size;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 900, height: 680, maxHeight: "92vh", display: "flex", flexDirection: "column" } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5, px: 2.5, borderBottom: "1px solid #EAECF0" }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#101828" }}>{title}</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel - Search */}
        <Box sx={{ width: 300, minWidth: 300, display: "flex", flexDirection: "column", borderRight: "1px solid #EAECF0" }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#101828", mb: 1 }}>Product Search</Typography>
            <Box sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
              {SEARCH_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  onClick={() => { setSearchType(t); setQuery(""); }}
                  sx={{
                    fontSize: 10,
                    fontWeight: 600,
                    height: 24,
                    border: `1px solid ${searchType === t ? "#7C5CFC" : "#D0D5DD"}`,
                    backgroundColor: searchType === t ? "#F0EDFF" : "#fff",
                    color: searchType === t ? "#7C5CFC" : "#667085",
                    cursor: "pointer",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              ))}
            </Box>
            <TextField
              size="small"
              fullWidth
              placeholder={`Search by ${searchType}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "#98A2B3" }} />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setQuery("")}>
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{ "& .MuiOutlinedInput-root": { fontSize: 12 } }}
            />
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {filtered.map((p) => (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderBottom: "1px solid #F2F4F7",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#F9FAFB" },
                }}
                onClick={() => addProduct(p)}
              >
                <Box sx={{ width: 30, height: 30, backgroundColor: "#F2F4F7", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {p.img}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 500, color: "#101828", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</Typography>
                  <Typography sx={{ color: "#98A2B3", fontSize: 10, mt: 0.25 }}>{p.id} · {p.sap} · {p.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#7C5CFC", flexShrink: 0 }}>+ Add</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Panel - Selected */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, borderBottom: "1px solid #EAECF0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#101828" }}>Selected Products</Typography>
              {items.length > 0 && (
                <Typography sx={{ fontSize: 11, color: "#667085" }}>{allProductIds.length} items</Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: 11, color: "#667085" }}>Condition between items</Typography>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={topCond}
                onChange={(_, v) => v && setTopCond(v)}
                sx={{ height: 26 }}
              >
                <ToggleButton value="AND" sx={{ fontSize: 11, fontWeight: 700, px: 1.5, textTransform: "none", "&.Mui-selected": { backgroundColor: "#1570EF", color: "#fff", "&:hover": { backgroundColor: "#1260D0" } } }}>AND</ToggleButton>
                <ToggleButton value="OR" sx={{ fontSize: 11, fontWeight: 700, px: 1.5, textTransform: "none", "&.Mui-selected": { backgroundColor: "#099250", color: "#fff", "&:hover": { backgroundColor: "#077840" } } }}>OR</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Group Toolbar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1, backgroundColor: "#FAFAFA", borderBottom: "1px solid #EAECF0" }}>
            {!groupMode ? (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={individualItems.length < 2}
                  onClick={() => { setGroupMode(true); setCheckedUids(new Set()); }}
                  sx={{ fontSize: 11, textTransform: "none" }}
                >
                  Group items
                </Button>
                <Typography sx={{ fontSize: 11, color: "#98A2B3" }}>Select individual products to group them</Typography>
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: 11, color: "#344054", fontWeight: 500 }}>Select products to group</Typography>
                <Typography sx={{ fontSize: 11, color: "#7C5CFC" }}>{checkedCount} selected</Typography>
                <Button
                  size="small"
                  variant="contained"
                  disabled={checkedCount < 2}
                  onClick={makeGroup}
                  sx={{ fontSize: 11, textTransform: "none", backgroundColor: "#7C5CFC", "&:hover": { backgroundColor: "#6A4CE0" } }}
                >
                  Create Group
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => { setGroupMode(false); setCheckedUids(new Set()); }}
                  sx={{ fontSize: 11, textTransform: "none" }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>

          {/* Items List */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {items.length === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180 }}>
                <Typography sx={{ fontSize: 28, mb: 0.5 }}>📦</Typography>
                <Typography sx={{ fontSize: 12, color: "#98A2B3" }}>Add products from the left panel</Typography>
              </Box>
            )}
            {items.map((item, idx) => (
              <Box key={item.type === "group" ? item.id : (item as ModalProductItem).uid}>
                {idx > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                    <ConditionBadge type={topCond} />
                  </Box>
                )}
                {item.type === "product" ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      border: checkedUids.has(item.uid) ? "1.5px solid #7C5CFC" : "1px solid #EAECF0",
                      borderRadius: 1,
                      px: 1,
                      py: 0.75,
                      mb: 0.5,
                      cursor: groupMode ? "pointer" : "default",
                      "&:hover": { backgroundColor: groupMode ? "#FAFAFA" : "transparent" },
                    }}
                    onClick={() => groupMode && toggleCheck(item.uid)}
                  >
                    {groupMode && (
                      <Checkbox size="small" checked={checkedUids.has(item.uid)} sx={{ p: 0 }} />
                    )}
                    <Box sx={{ width: 28, height: 28, backgroundColor: "#F2F4F7", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                      {item.img}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 500, color: "#101828", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</Typography>
                      <Typography sx={{ fontSize: 10, color: "#98A2B3" }}>{item.id} · {item.sap} · {item.label}</Typography>
                    </Box>
                    {!groupMode && (
                      <IconButton size="small" onClick={() => removeItem(idx)} sx={{ color: "#98A2B3" }}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ backgroundColor: item.color.bg, border: `1.5px solid ${item.color.border}`, borderRadius: 1.5, p: 1.5, mb: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip label={item.name} size="small" sx={{ fontSize: 10, fontWeight: 700, color: item.color.text, backgroundColor: item.color.badge, height: 20, "& .MuiChip-label": { px: 1 } }} />
                        <Typography sx={{ fontSize: 10, color: item.color.text }}>Condition within group</Typography>
                        <ToggleButtonGroup size="small" exclusive value={item.condition} onChange={() => toggleGroupCond(idx)} sx={{ height: 22 }}>
                          <ToggleButton value="AND" sx={{ fontSize: 10, fontWeight: 700, px: 1, textTransform: "none", "&.Mui-selected": { backgroundColor: "#1570EF", color: "#fff" } }}>AND</ToggleButton>
                          <ToggleButton value="OR" sx={{ fontSize: 10, fontWeight: 700, px: 1, textTransform: "none", "&.Mui-selected": { backgroundColor: "#099250", color: "#fff" } }}>OR</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                      <Button size="small" onClick={() => removeItem(idx)} sx={{ fontSize: 11, color: item.color.text, textTransform: "none", minWidth: 0 }}>
                        Ungroup <CloseIcon sx={{ fontSize: 12, ml: 0.5 }} />
                      </Button>
                    </Box>
                    {item.products.map((p, pi) => (
                      <Box key={p.id}>
                        {pi > 0 && (
                          <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                            <ConditionBadge type={item.condition} size="small" />
                          </Box>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, backgroundColor: "#fff", border: `1px solid ${item.color.border}44`, borderRadius: 1, px: 1, py: 0.5, mb: 0.5 }}>
                          <Typography sx={{ fontSize: 14 }}>{p.img}</Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 500, color: "#101828", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</Typography>
                            <Typography sx={{ fontSize: 10, color: "#98A2B3" }}>{p.id} · {p.sap}</Typography>
                          </Box>
                          <IconButton size="small" onClick={() => removeProductFromGroup(idx, p.id)} sx={{ color: "#98A2B3" }}>
                            <CloseIcon sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* Condition Summary */}
          {items.length > 0 && (
            <Box sx={{ mx: 2, mb: 1.5, backgroundColor: "#F9FAFB", border: "1px solid #EAECF0", borderRadius: 1, p: 1.5 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#98A2B3", letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.75 }}>Condition Summary</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5 }}>
                {items.map((item, idx) => (
                  <Box key={idx} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                    {idx > 0 && <ConditionBadge type={topCond} size="small" />}
                    {item.type === "product" ? (
                      <Chip
                        icon={<span>{item.img}</span>}
                        label={item.name}
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 500, backgroundColor: "#F2F4F7", border: "1px solid #D0D5DD", "& .MuiChip-label": { maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" } }}
                      />
                    ) : (
                      <Chip
                        label={`${item.name} (${item.products.length} items)`}
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 500, backgroundColor: item.color.bg, border: `1px solid ${item.color.border}`, color: item.color.text }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <DialogActions sx={{ borderTop: "1px solid #EAECF0", px: 2.5, py: 1.5, justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 11, color: "#98A2B3" }}>
          {allProductIds.length > 0
            ? `${allProductIds.length} product${allProductIds.length > 1 ? "s" : ""} selected`
            : "No products selected"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none" }}>Close</Button>
          <Button
            variant="contained"
            disabled={allProductIds.length === 0}
            onClick={() => onConfirm(items, topCond)}
            sx={{ textTransform: "none", backgroundColor: "#7C5CFC", "&:hover": { backgroundColor: "#6A4CE0" } }}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

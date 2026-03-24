"use client";

import CasinoIcon from "@mui/icons-material/Casino";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Chip } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { ModalProduct } from "./ProductModal";

// --- Types ---
export interface RewardSelectedItem extends ModalProduct {
  uid: number;
}

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

const SEARCH_TYPES = ["SKU Code", "SAP Code", "Label", "Product Name"] as const;

let uidCounter = 1000;

interface RewardModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: RewardSelectedItem[], isRandom: boolean) => void;
  initialSelected?: RewardSelectedItem[];
  initialRandom?: boolean;
}

export default function RewardModal({
  open,
  onClose,
  onConfirm,
  initialSelected = [],
  initialRandom = false,
}: RewardModalProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<(typeof SEARCH_TYPES)[number]>("SKU Code");
  const [selected, setSelected] = useState<RewardSelectedItem[]>(initialSelected);
  const [isRandom, setIsRandom] = useState(initialRandom);

  useEffect(() => {
    if (open) {
      setSelected(initialSelected);
      setIsRandom(initialRandom);
      setQuery("");
    }
  }, [open, initialSelected, initialRandom]);

  const filtered = PRODUCTS.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (searchType === "SKU Code") return p.id.toLowerCase().includes(q);
    if (searchType === "SAP Code") return p.sap.toLowerCase().includes(q);
    if (searchType === "Label") return p.label.toLowerCase().includes(q);
    if (searchType === "Product Name") return p.name.toLowerCase().includes(q);
    return true;
  });

  const isChecked = (id: string) => selected.some((s) => s.id === id);

  const toggleProduct = useCallback((p: ModalProduct) => {
    setSelected((prev) =>
      prev.find((s) => s.id === p.id)
        ? prev.filter((s) => s.id !== p.id)
        : [...prev, { uid: uidCounter++, ...p }],
    );
  }, []);

  const remove = useCallback((uid: number) => {
    setSelected((prev) => prev.filter((s) => s.uid !== uid));
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: { width: 820, height: 620, maxHeight: "92vh", display: "flex", flexDirection: "column" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          py: 1.5,
          px: 2.5,
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#101828" }}>
            Add Reward Products
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#667085", mt: 0.25 }}>
            Select products to be given as rewards
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left — Search */}
        <Box
          sx={{
            width: 300,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #EAECF0",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#101828", mb: 1 }}>
              Product Search
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
              {SEARCH_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  onClick={() => {
                    setSearchType(t);
                    setQuery("");
                  }}
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
            {filtered.map((p) => {
              const checked = isChecked(p.id);
              return (
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
                    backgroundColor: checked ? "#FAFBFF" : "#fff",
                    "&:hover": { backgroundColor: checked ? "#FAFBFF" : "#F9FAFB" },
                  }}
                  onClick={() => toggleProduct(p)}
                >
                  <Checkbox size="small" checked={checked} sx={{ p: 0 }} />
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: "#F2F4F7",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {p.img}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "#101828",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </Typography>
                    <Typography sx={{ color: "#98A2B3", fontSize: 10, mt: 0.25 }}>
                      {p.id} · {p.sap} · {p.label}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Right — Selected & Options */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Random toggle */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #EAECF0",
              backgroundColor: isRandom ? "#F0EDFF" : "#FAFAFA",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#101828" }}>
                  Random Reward
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#667085", mt: 0.25 }}>
                  {isRandom
                    ? "One product will be randomly selected and given as reward."
                    : "All selected products will be given as rewards."}
                </Typography>
              </Box>
              <Switch
                checked={isRandom}
                onChange={() => setIsRandom((p) => !p)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#7C5CFC" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#7C5CFC",
                  },
                }}
              />
            </Box>
            {isRandom && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                  p: 1,
                  backgroundColor: "#fff",
                  border: "1px solid #C4B5FD",
                  borderRadius: 1,
                }}
              >
                <CasinoIcon sx={{ fontSize: 16, color: "#7C5CFC" }} />
                <Typography sx={{ fontSize: 12, color: "#4C2EC7" }}>
                  1 item will be randomly selected from the list below for each qualifying purchase.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Selected list */}
          <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#344054" }}>
              Selected Products
            </Typography>
            {selected.length > 0 && (
              <Typography sx={{ fontSize: 11, color: "#667085" }}>
                {selected.length} item{selected.length > 1 ? "s" : ""}
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 1.5 }}>
            {selected.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 160,
                }}
              >
                <Typography sx={{ fontSize: 26, mb: 0.5 }}>🎁</Typography>
                <Typography sx={{ fontSize: 12, color: "#98A2B3" }}>
                  Select reward products from the left
                </Typography>
              </Box>
            )}
            {selected.map((p, idx) => (
              <Box
                key={p.uid}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid #EAECF0",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  mb: 0.5,
                  backgroundColor: "#fff",
                }}
              >
                {isRandom && (
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: "#F0EDFF",
                      border: "1px solid #C4B5FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#7C5CFC",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </Box>
                )}
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#F2F4F7",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {p.img}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: "#101828",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: "#98A2B3" }}>
                    {p.id} · {p.sap} · {p.label}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => remove(p.uid)} sx={{ color: "#98A2B3" }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <DialogActions
        sx={{
          borderTop: "1px solid #EAECF0",
          px: 2.5,
          py: 1.5,
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 11, color: "#98A2B3" }}>
          {selected.length > 0
            ? isRandom
              ? `1 product will be randomly selected from ${selected.length} item${selected.length > 1 ? "s" : ""}`
              : `${selected.length} product${selected.length > 1 ? "s" : ""} will all be rewarded`
            : "No products selected"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none" }}>
            Close
          </Button>
          <Button
            variant="contained"
            disabled={selected.length === 0}
            onClick={() => onConfirm(selected, isRandom)}
            sx={{
              textTransform: "none",
              backgroundColor: "#7C5CFC",
              "&:hover": { backgroundColor: "#6A4CE0" },
            }}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

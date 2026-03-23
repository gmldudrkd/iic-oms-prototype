"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface BrandCorpConfig {
  brand: string;
  corps: string[];
}

const BRAND_CORP_CONFIG: BrandCorpConfig[] = [
  { brand: "GM", corps: ["KR", "US", "JP", "AU", "SG", "TW"] },
  { brand: "TAM", corps: ["KR", "JP"] },
  { brand: "ATS", corps: ["KR"] },
  { brand: "NUF", corps: ["KR"] },
];

interface RequestPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    selected: { brand: string; corp: string }[],
    reason: string,
  ) => void;
}

export default function RequestPermissionModal({
  open,
  onClose,
  onSubmit,
}: RequestPermissionModalProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState("");

  const toggleCheck = (brand: string, corp: string) => {
    const key = `${brand}-${corp}`;
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    const items = Object.entries(selected)
      .filter(([, checked]) => checked)
      .map(([key]) => {
        const [brand, corp] = key.split("-");
        return { brand, corp };
      });
    onSubmit(items, reason);
    setSelected({});
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setSelected({});
    setReason("");
    onClose();
  };

  // Build flat column list for rendering
  const columns: { brand: string; corp: string }[] = [];
  BRAND_CORP_CONFIG.forEach((bc) => {
    bc.corps.forEach((corp) => {
      columns.push({ brand: bc.brand, corp });
    });
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "8px", overflow: "hidden" } }}
    >
      {/* Blue Header */}
      <div className="flex items-center justify-between bg-[#42A5F5] px-[24px] py-[16px]">
        <h2 className="text-[18px] font-semibold text-white">
          Request Permission
        </h2>
        <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
        <p className="mb-[20px] text-[14px] text-black/70">
          Select each brand and corporation you want to access
        </p>

        {/* Brand/Corp Matrix Table */}
        <div className="mb-[24px] overflow-x-auto">
          <table className="w-full border-collapse text-center text-[13px]">
            <thead>
              {/* Brand row */}
              <tr>
                {BRAND_CORP_CONFIG.map((bc) => (
                  <th
                    key={bc.brand}
                    colSpan={bc.corps.length}
                    className="border border-[#e0e0e0] bg-[#fafafa] px-[8px] py-[8px] font-semibold"
                  >
                    {bc.brand}
                  </th>
                ))}
              </tr>
              {/* Corp row */}
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="border border-[#e0e0e0] px-[6px] py-[6px] text-[12px] font-normal text-black/60"
                  >
                    {col.corp}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {columns.map((col, idx) => {
                  const key = `${col.brand}-${col.corp}`;
                  return (
                    <td
                      key={idx}
                      className="border border-[#e0e0e0] px-[4px] py-[4px]"
                    >
                      <Checkbox
                        size="small"
                        checked={!!selected[key]}
                        onChange={() => toggleCheck(col.brand, col.corp)}
                        sx={{ p: 0 }}
                      />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reason */}
        <div>
          <p className="mb-[4px] text-[12px] text-black/50">Reason</p>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Please enter the reason for the request"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}
          sx={{ minWidth: 80 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ minWidth: 80 }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

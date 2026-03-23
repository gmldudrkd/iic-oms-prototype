"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function PermissionLegend() {
  return (
    <div className="mx-[24px] mb-[24px] flex items-center gap-[24px] rounded-[5px] border border-outlined bg-white px-[24px] py-[14px]">
      <p className="text-[13px] font-semibold text-black/60">
        Permission Legend:
      </p>
      <span className="flex items-center gap-[6px] text-[13px] text-black/70">
        <ShieldOutlinedIcon sx={{ fontSize: 18, color: "#1565C0" }} />
        Admin
      </span>
      <span className="flex items-center gap-[6px] text-[13px] text-black/70">
        <PeopleAltOutlinedIcon sx={{ fontSize: 18, color: "#2e7d32" }} />
        Manager
      </span>
      <span className="flex items-center gap-[6px] text-[13px] text-black/70">
        <AccessTimeIcon sx={{ fontSize: 18, color: "#e65100" }} />
        Request (요청 중)
      </span>
      <span className="flex items-center gap-[6px] text-[13px] text-black/70">
        <RemoveIcon sx={{ fontSize: 18, color: "#757575" }} />
        None (없음)
      </span>
    </div>
  );
}

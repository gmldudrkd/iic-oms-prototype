"use client";

import { Chip } from "@mui/material";

interface UserDetailCardProps {
  requestedDate: string;
  approvalStatus: string;
  userStatus: string;
}

export default function UserDetailCard({
  requestedDate,
  approvalStatus,
  userStatus,
}: UserDetailCardProps) {
  return (
    <div className="mx-[24px] mt-[24px] rounded-[5px] border border-outlined bg-white">
      <div className="border-b border-outlined px-[24px] py-[16px] text-[16px] font-bold">
        User Detail
      </div>
      <div className="px-[24px] py-[20px]">
        <div className="grid grid-cols-2 gap-y-[12px]">
          <div className="flex items-center gap-[16px]">
            <span className="min-w-[130px] text-[13px] font-semibold text-black/60">
              Requested Date
            </span>
            <span className="text-[14px]">{requestedDate}</span>
          </div>
          <div className="flex items-center gap-[16px]">
            <span className="min-w-[130px] text-[13px] font-semibold text-black/60">
              Approval Status
            </span>
            <Chip
              label={approvalStatus}
              color={approvalStatus === "AWAITING" ? "warning" : "success"}
              size="small"
            />
          </div>
          <div className="flex items-center gap-[16px]">
            <span className="min-w-[130px] text-[13px] font-semibold text-black/60">
              User Status
            </span>
            <Chip
              label={userStatus}
              size="small"
              variant="outlined"
              sx={{ color: "rgba(0,0,0,0.6)", borderColor: "#e0e0e0" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Chip, Popover, SvgIconProps } from "@mui/material";
import { useState } from "react";

import {
  PermissionEntry,
  PermissionRole,
  getPermissionSummary,
  groupByBrand,
} from "@/features/user-list/modules/mockUserList";

const ROLE_CONFIG: Record<
  PermissionRole,
  {
    label: string;
    color: string;
    bg: string;
    Icon: React.ComponentType<SvgIconProps>;
  }
> = {
  ADMIN: {
    label: "Admin",
    color: "#1565C0",
    bg: "#e3f2fd",
    Icon: ShieldOutlinedIcon,
  },
  MANAGER: {
    label: "Manager",
    color: "#2e7d32",
    bg: "#e8f5e9",
    Icon: PeopleAltOutlinedIcon,
  },
  REQUEST: {
    label: "Request",
    color: "#e65100",
    bg: "#fff3e0",
    Icon: AccessTimeIcon,
  },
  NONE: {
    label: "None",
    color: "#757575",
    bg: "#f5f5f5",
    Icon: RemoveIcon,
  },
};

interface PermissionCellProps {
  permissions: PermissionEntry[];
}

export default function PermissionCell({ permissions }: PermissionCellProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const summary = getPermissionSummary(permissions);
  const grouped = groupByBrand(permissions);
  const brandCount = Object.keys(grouped).length;
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Summary badges */}
      <div
        onClick={handleClick}
        className="flex cursor-pointer items-center gap-[8px] rounded-[4px] px-[8px] py-[4px] transition-colors hover:bg-black/[0.04]"
      >
        {(["ADMIN", "MANAGER", "REQUEST", "NONE"] as PermissionRole[]).map(
          (role) => {
            if (summary[role] === 0) return null;
            const { Icon, color } = ROLE_CONFIG[role];
            return (
              <span
                key={role}
                className="flex items-center gap-[3px] text-[13px]"
              >
                <Icon sx={{ fontSize: 18, color }} />
                <span style={{ fontWeight: 600, color }}>{summary[role]}</span>
              </span>
            );
          },
        )}
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 16,
            color: "rgba(0,0,0,0.38)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </div>

      {/* Detail Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              minWidth: 280,
              maxWidth: 360,
              maxHeight: 320,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        {/* Fixed header */}
        <div className="flex-shrink-0 px-[16px] pt-[16px] pb-[8px]">
          <p className="text-[14px] font-bold">Permission Details</p>
          <p className="text-[12px] text-black/50">
            {permissions.length} permissions across {brandCount} brands
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-[16px] pb-[16px]">
          {Object.entries(grouped).map(([brand, group]) => (
            <div key={brand} className="mb-[12px] last:mb-0">
              <p className="mb-[6px] text-[13px] font-semibold text-black/70">
                {group.brandDescription}{" "}
                <span className="text-[11px] font-normal text-black/40">
                  ({brand})
                </span>
              </p>
              <div className="flex flex-col gap-[4px] pl-[8px]">
                {group.entries.map((entry, idx) => {
                  const config = ROLE_CONFIG[entry.role];
                  const RoleIcon = config.Icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[13px] text-black/80">
                        {entry.corpDescription}
                      </span>
                      <Chip
                        icon={
                          <RoleIcon
                            sx={{ fontSize: 14, color: `${config.color} !important` }}
                          />
                        }
                        label={config.label}
                        size="small"
                        sx={{
                          height: "24px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: config.bg,
                          color: config.color,
                          "& .MuiChip-label": { px: "6px" },
                          "& .MuiChip-icon": { ml: "6px" },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
}

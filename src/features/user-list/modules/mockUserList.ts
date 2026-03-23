/**
 * User List Mock Data for Prototype
 */

export type PermissionRole = "ADMIN" | "MANAGER" | "REQUEST" | "NONE";

export interface PermissionEntry {
  brand: string;
  brandDescription: string;
  corp: string;
  corpDescription: string;
  role: PermissionRole;
}

export interface UserListItem {
  id: number;
  requestedDate: string;
  email: string;
  approveStatus: "AWAITING" | "APPROVAL" | "REJECTED";
  permissions: PermissionEntry[];
}

const BRAND_MAP: Record<string, string> = {
  GM: "Gentle Monster",
  TAM: "Tamburins",
  NUO: "Nudake",
  ATS: "Atiissu",
  NUF: "Nuflaat",
};

const CORP_MAP: Record<string, string> = {
  KR: "Korea (KR)",
  US: "United States (US)",
  JP: "Japan (JP)",
  AU: "Australia (AU)",
  CA: "Canada (CA)",
  TW: "Taiwan (TW)",
  SG: "Singapore (SG)",
  HK: "Hong Kong (HK)",
  CN: "China (CN)",
};

const ROLES: PermissionRole[] = ["ADMIN", "MANAGER", "REQUEST", "NONE"];

function generatePermissions(hasRequests: boolean): PermissionEntry[] {
  const perms: PermissionEntry[] = [];
  const brands = Object.keys(BRAND_MAP);
  const corps = Object.keys(CORP_MAP);

  const brandCount = 1 + Math.floor(Math.random() * 3);
  const selectedBrands = brands
    .sort(() => Math.random() - 0.5)
    .slice(0, brandCount);

  for (const brand of selectedBrands) {
    const corpCount = 2 + Math.floor(Math.random() * 4);
    const selectedCorps = corps
      .sort(() => Math.random() - 0.5)
      .slice(0, corpCount);

    for (const corp of selectedCorps) {
      let role: PermissionRole;
      if (hasRequests && Math.random() < 0.2) {
        role = "REQUEST";
      } else {
        const weightedRoles: PermissionRole[] = [
          "ADMIN",
          "MANAGER",
          "MANAGER",
          "MANAGER",
        ];
        role = weightedRoles[Math.floor(Math.random() * weightedRoles.length)];
      }
      perms.push({
        brand,
        brandDescription: BRAND_MAP[brand],
        corp,
        corpDescription: CORP_MAP[corp],
        role,
      });
    }
  }
  return perms;
}

export const mockUserListData: UserListItem[] = [
  {
    id: 119,
    requestedDate: "2025.12.02 00:00:00",
    email: "monster9999@gentlemonster.com",
    approveStatus: "AWAITING",
    permissions: generatePermissions(true),
  },
  {
    id: 118,
    requestedDate: "2025.12.02 00:00:00",
    email: "monster@gentlemonster.com",
    approveStatus: "AWAITING",
    permissions: generatePermissions(true),
  },
  {
    id: 117,
    requestedDate: "2025.12.01 14:30:00",
    email: "admin.user@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
  {
    id: 116,
    requestedDate: "2025.12.01 00:00:00",
    email: "monster9996@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
  {
    id: 115,
    requestedDate: "2025.12.01 00:00:00",
    email: "monster9995@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
  {
    id: 114,
    requestedDate: "2025.11.30 00:00:00",
    email: "monster9994@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
  {
    id: 113,
    requestedDate: "2025.11.30 00:00:00",
    email: "monster9993@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
  {
    id: 112,
    requestedDate: "2025.11.29 00:00:00",
    email: "monster9992@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
  {
    id: 111,
    requestedDate: "2025.11.29 00:00:00",
    email: "monster9991@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
  {
    id: 110,
    requestedDate: "2025.11.28 00:00:00",
    email: "monster9990@gentlemonster.com",
    approveStatus: "APPROVAL",
    permissions: generatePermissions(false),
  },
];

/** Permission role count summary */
export function getPermissionSummary(permissions: PermissionEntry[]) {
  const counts = { ADMIN: 0, MANAGER: 0, REQUEST: 0, NONE: 0 };
  permissions.forEach((p) => counts[p.role]++);
  return counts;
}

/** Group permissions by brand */
export function groupByBrand(permissions: PermissionEntry[]) {
  const grouped: Record<
    string,
    { brandDescription: string; entries: PermissionEntry[] }
  > = {};
  permissions.forEach((p) => {
    if (!grouped[p.brand]) {
      grouped[p.brand] = { brandDescription: p.brandDescription, entries: [] };
    }
    grouped[p.brand].entries.push(p);
  });
  return grouped;
}

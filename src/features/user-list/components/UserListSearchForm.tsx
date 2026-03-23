"use client";

import CheckIcon from "@mui/icons-material/Check";
import {
  Button,
  FormControl,
  InputBase,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const EMAIL_DOMAINS = ["gentlemonster.com"];
const DIRECT_INPUT = "__direct__";

interface UserListSearchFormProps {
  searchKey: string;
  searchValue: string;
  emailDomain: string;
  statusFilter: string;
  onSearchKeyChange: (value: string) => void;
  onSearchValueChange: (value: string) => void;
  onEmailDomainChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onReset: () => void;
  onSearch: () => void;
}

export default function UserListSearchForm({
  searchKey,
  searchValue,
  emailDomain,
  statusFilter,
  onSearchKeyChange,
  onSearchValueChange,
  onEmailDomainChange,
  onStatusFilterChange,
  onReset,
  onSearch,
}: UserListSearchFormProps) {
  const isEmail = searchKey === "email";
  const isDirectInput = emailDomain === DIRECT_INPUT;

  return (
    <div className="flex items-end justify-between gap-[16px] bg-white px-[24px] py-[24px]">
      <div className="flex flex-wrap items-end gap-[16px]">
        {/* Search Field */}
        <div className="flex flex-col gap-[4px]">
          <p className="text-[12px] text-black/60">Search</p>
          <FormControl
            size="small"
            variant="outlined"
            sx={{
              flexDirection: "row",
              alignItems: "center",
              border: "1px solid rgba(0,0,0,0.23)",
              borderRadius: "4px",
              "&:hover": { borderColor: "rgba(0,0,0,0.87)" },
              "&:focus-within": {
                borderColor: "#42A5F5",
                borderWidth: "2px",
              },
            }}
          >
            {/* Search Key Select */}
            <Select
              value={searchKey}
              onChange={(e) => onSearchKeyChange(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{
                minWidth: 80,
                px: 1.5,
                "& .MuiSelect-select": {
                  py: "8.5px",
                  fontWeight: 600,
                  fontSize: "14px",
                },
              }}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="id">ID</MenuItem>
            </Select>

            {/* Divider */}
            <div className="h-[24px] w-[1px] bg-black/20" />

            {/* Input */}
            <InputBase
              placeholder={isEmail ? "Enter the ID" : "Enter the Keyword"}
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              sx={{
                flex: 1,
                px: 1.5,
                fontSize: "14px",
                minWidth: isEmail ? 200 : 280,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
            />

            {/* Email Domain */}
            {isEmail && (
              <>
                <span className="text-[14px] text-black/50">@</span>
                {isDirectInput ? (
                  <InputBase
                    placeholder="domain.com"
                    value={
                      emailDomain === DIRECT_INPUT ? "" : emailDomain
                    }
                    onChange={(e) => onEmailDomainChange(e.target.value || DIRECT_INPUT)}
                    sx={{
                      px: 1,
                      fontSize: "14px",
                      minWidth: 120,
                    }}
                  />
                ) : (
                  <Select
                    value={emailDomain}
                    onChange={(e) => {
                      onEmailDomainChange(e.target.value);
                    }}
                    variant="standard"
                    disableUnderline
                    renderValue={(value) => (
                      <span className="text-[14px]">{value}</span>
                    )}
                    sx={{
                      minWidth: 160,
                      px: 1,
                      "& .MuiSelect-select": {
                        py: "8.5px",
                        fontSize: "14px",
                      },
                    }}
                  >
                    {EMAIL_DOMAINS.map((domain) => (
                      <MenuItem key={domain} value={domain}>
                        <ListItemText
                          primary={domain}
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                        {emailDomain === domain && (
                          <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                            <CheckIcon sx={{ fontSize: 18 }} />
                          </ListItemIcon>
                        )}
                      </MenuItem>
                    ))}
                    <MenuItem value={DIRECT_INPUT}>
                      <ListItemText
                        primary="직접 입력"
                        primaryTypographyProps={{ fontSize: "14px" }}
                      />
                    </MenuItem>
                  </Select>
                )}
              </>
            )}
          </FormControl>
        </div>

        {/* Approve Status Filter */}
        <div className="flex flex-col gap-[4px]">
          <p className="text-[12px] text-black/60">Approve Status Filter</p>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value="AWAITING">AWAITING</MenuItem>
              <MenuItem value="APPROVAL">APPROVAL</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 gap-[8px]">
        <Button color="primary" onClick={onReset}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={onSearch}>
          Search
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import PermissionLegend from "@/features/user-list/components/PermissionLegend";
import UserListDataGrid from "@/features/user-list/components/UserListDataGrid";
import UserListSearchForm from "@/features/user-list/components/UserListSearchForm";
import { mockUserListData } from "@/features/user-list/modules/mockUserList";

const DIRECT_INPUT = "__direct__";

export default function UserList() {
  const [searchKey, setSearchKey] = useState("email");
  const [searchValue, setSearchValue] = useState("");
  const [emailDomain, setEmailDomain] = useState("gentlemonster.com");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    searchKey: "",
    searchValue: "",
    statusFilter: "",
  });

  const filteredData = useMemo(() => {
    return mockUserListData.filter((user) => {
      // Status filter
      if (
        appliedFilters.statusFilter &&
        user.approveStatus !== appliedFilters.statusFilter
      ) {
        return false;
      }
      // Search filter
      if (appliedFilters.searchValue) {
        const val = appliedFilters.searchValue.toLowerCase();
        if (appliedFilters.searchKey === "email") {
          return user.email.toLowerCase().includes(val);
        }
        if (appliedFilters.searchKey === "id") {
          return String(user.id).includes(val);
        }
        return user.email.toLowerCase().includes(val);
      }
      return true;
    });
  }, [appliedFilters]);

  const handleReset = () => {
    setSearchKey("email");
    setSearchValue("");
    setEmailDomain("gentlemonster.com");
    setStatusFilter("");
    setAppliedFilters({ searchKey: "", searchValue: "", statusFilter: "" });
  };

  const handleSearch = () => {
    let fullSearchValue = searchValue;
    if (searchKey === "email" && searchValue) {
      const domain =
        emailDomain === DIRECT_INPUT ? "" : emailDomain;
      fullSearchValue = domain
        ? `${searchValue}@${domain}`
        : searchValue;
    }
    setAppliedFilters({
      searchKey,
      searchValue: fullSearchValue,
      statusFilter,
    });
  };

  return (
    <>
      <UserListSearchForm
        searchKey={searchKey}
        searchValue={searchValue}
        emailDomain={emailDomain}
        statusFilter={statusFilter}
        onSearchKeyChange={setSearchKey}
        onSearchValueChange={setSearchValue}
        onEmailDomainChange={setEmailDomain}
        onStatusFilterChange={setStatusFilter}
        onReset={handleReset}
        onSearch={handleSearch}
      />
      <UserListDataGrid data={filteredData} />
      <PermissionLegend />
    </>
  );
}

"use client";

import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import MultiRegisterDialog from "@/features/promotion-template/components/MultiRegisterDialog";
import SearchForm from "@/features/promotion-template/components/SearchForm";
import TemplateCard, {
  NewTemplateCard,
} from "@/features/promotion-template/components/TemplateCard";
import TemplateFormDialog from "@/features/promotion-template/components/TemplateFormDialog";
import {
  BORDER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
} from "@/features/promotion-template/modules/constants";
import {
  MOCK_TEMPLATES,
  createTemplate,
  deleteTemplate,
  updateTemplate,
} from "@/features/promotion-template/modules/mockData";
import type {
  MultiRegisterRow,
  PromotionTemplate as TemplateModel,
  TemplateDraft,
} from "@/features/promotion-template/modules/types";
import {
  TemplateSearchValues,
  availableChannelsFor,
  brandCorpOf,
  filterTemplates,
  registerPromotions,
} from "@/features/promotion-template/modules/utils";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import TotalResult from "@/shared/components/text/TotalResult";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

interface Props {
  // 페이지 상단 "+ New Template" 버튼과 드로어를 연결하기 위한 외부 트리거
  openNewSignal?: number;
}

export default function PromotionTemplate({ openNewSignal = 0 }: Props) {
  const selectedPermission = useUserPermissionStore(
    (s) => s.selectedPermission,
  );
  const openSnackbar = useSnackbarStore((s) => s.openSnackbar);

  // 상단 헤더 Brand & Corp 기준 채널 목록 / 브랜드·법인
  const channels = useMemo(
    () => availableChannelsFor(selectedPermission),
    [selectedPermission],
  );
  const brandCorp = useMemo(
    () => brandCorpOf(selectedPermission),
    [selectedPermission],
  );

  // 검색 폼 (Promotion List 와 동일 구성에서 Channel · Search 만 사용) — Search 버튼을 눌렀을 때만 적용
  const searchDefaults = useMemo<TemplateSearchValues>(
    () => ({
      promotionType: "",
      searchKeyType: "title",
      searchKeyword: "",
    }),
    [],
  );
  const methods = useForm<TemplateSearchValues>({
    defaultValues: searchDefaults,
  });
  const [applied, setApplied] = useState<TemplateSearchValues>(searchDefaults);
  const handleSearch = useCallback(() => {
    setApplied({ ...methods.getValues() });
  }, [methods]);
  const handleReset = useCallback(() => {
    methods.reset(searchDefaults);
    setApplied(searchDefaults);
  }, [methods, searchDefaults]);
  // 모듈 스코프 배열이 바뀔 때 리렌더를 위한 버전 카운터
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateModel | null>(null);
  const [multiTarget, setMultiTarget] = useState<TemplateModel | null>(null);
  // 삭제 확인 대기 중인 템플릿
  const [deleting, setDeleting] = useState<TemplateModel | null>(null);

  const templates = useMemo(
    () => filterTemplates(MOCK_TEMPLATES, applied),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applied, version],
  );

  const openNew = useCallback(() => {
    setEditing(null);
    setDrawerOpen(true);
  }, []);
  const openEdit = useCallback((t: TemplateModel) => {
    setEditing(t);
    setDrawerOpen(true);
  }, []);

  // 상단 "+ New Template" 버튼 클릭 → 신규 드로어
  useEffect(() => {
    if (openNewSignal > 0) openNew();
  }, [openNewSignal, openNew]);

  const handleSave = useCallback(
    (draft: TemplateDraft) => {
      if (editing) updateTemplate(editing.id, draft);
      else createTemplate(draft);
      bump();
      setDrawerOpen(false);
      openSnackbar({
        message: editing ? "Template updated." : "Template created.",
        severity: "success",
      });
    },
    [editing, openSnackbar],
  );

  const handleRegister = useCallback(
    (rows: MultiRegisterRow[]) => {
      if (!multiTarget) return;
      const created = registerPromotions(multiTarget, rows, brandCorp);
      bump();
      setMultiTarget(null);
      openSnackbar({
        message: `${created.length} promotions registered as Draft.\nEnter reward quantity and activate each one from Promotion List.`,
        severity: "success",
      });
    },
    [multiTarget, brandCorp, openSnackbar],
  );

  const handleDelete = useCallback(() => {
    if (!deleting) return;
    const { name } = deleting;
    deleteTemplate(deleting.id);
    bump();
    setDeleting(null);
    // 편집 팝업에서 삭제한 경우 팝업도 닫는다
    setDrawerOpen(false);
    setEditing(null);
    openSnackbar({
      message: `Template "${name}" deleted.`,
      severity: "success",
    });
  }, [deleting, openSnackbar]);

  return (
    <FormProvider {...methods}>
      {/* Search Form — Promotion List 와 동일한 영역 구성 */}
      <div className="border-b border-outlined bg-white">
        <div className="px-[24px]">
          <SearchForm onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>
      <Box
        sx={{ background: "#F5F5F5", minHeight: "calc(100vh - 140px)", p: 3 }}
      >
        <Box
          sx={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            p: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 1.75,
          }}
        >
          {/* 결과 건수 — Promotion List 와 동일 표기 */}
          <TotalResult totalResult={templates.length} classNames="!mb-0" />

          {/* grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 1.5,
            }}
          >
            {templates.map((t) => (
              <TemplateCard
                key={`${t.id}-${version}`}
                template={t}
                onEdit={openEdit}
                onMulti={setMultiTarget}
                onDelete={setDeleting}
              />
            ))}
            <NewTemplateCard onClick={openNew} />
          </Box>
        </Box>

        <TemplateFormDialog
          open={drawerOpen}
          editing={editing}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
          onDelete={setDeleting}
        />
        <AlertDialog
          open={!!deleting}
          setOpen={(o) => {
            if (!o) setDeleting(null);
          }}
          isButton={false}
          dialogTitle="Delete Template"
          dialogContent={
            deleting
              ? `Delete template "${deleting.name}"? Promotions already registered from this template are not affected.`
              : ""
          }
          dialogCloseLabel="Cancel"
          dialogConfirmLabel="Delete"
          handlePost={handleDelete}
          postButtonProps={{ color: "error" }}
        />
        <MultiRegisterDialog
          open={!!multiTarget}
          template={multiTarget}
          channels={channels}
          onClose={() => setMultiTarget(null)}
          onRegister={handleRegister}
        />
      </Box>
    </FormProvider>
  );
}

export const MODAL_CONFIG = {
  approve: {
    text: "Are you sure you want to approve this permission?\nThis action will be recorded as your responsibility.\nPlease make sure it's appropriate to grant access to the email's owner.",
    confirmLabel: "Approve",
    postButtonClassNames: "",
  },
  reject: {
    text: "Are you sure you want to reject this permission?\nThis will permanently delete the data.",
    confirmLabel: "Reject",
    postButtonClassNames: "!text-error",
  },
} as const;

import z from "zod";

export const RegisterClaimSchema = z
  .object({
    claimReason: z.string().min(1),
    claimReasonOthers: z.string().optional(),
    carrierCode: z.string().optional().or(z.literal("")),
    trackingNo: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // 1) claimReason이 Others일 때 Others 입력 필수
    if (data.claimReason.includes("Others") && !data.claimReasonOthers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter additional details.",
        path: ["claimReasonOthers"],
      });
    }

    // 2) carrierCode가 있을 때 trackingNo 필수
    if (data.carrierCode && !data.trackingNo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tracking number is required.",
        path: ["trackingNo"],
      });
    }
  });

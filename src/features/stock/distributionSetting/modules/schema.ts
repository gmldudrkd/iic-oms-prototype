import { z } from "zod";

export const DistributionSettingSchema = z.object({
  rateType: z.string(),

  distributionRates: z
    .array(
      z.object({
        channelType: z.string(),
        description: z.string().optional(),
        distributionRate: z
          .union([z.string(), z.number()])
          .transform((val) => (val === "" ? undefined : Number(val)))
          .refine((val) => val !== undefined, {
            message: "All information must be entered to save.",
          }),
      }),
    )
    .refine((rates) => rates.every((r) => r.distributionRate !== undefined), {
      message: "All information must be entered to save.",
      path: ["distributionRates"],
    })
    .refine(
      (rates) =>
        rates.reduce((sum, r) => sum + (r.distributionRate ?? 0), 0) <= 100,
      {
        message: "The total of Distribution Rate cannot exceed 100%",
        path: ["distributionRates"],
      },
    ),
});

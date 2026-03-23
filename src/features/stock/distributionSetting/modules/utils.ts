import { FieldErrors } from "react-hook-form";

export const collectErrorMessages = (
  errors: FieldErrors<{
    rateType: string;
    distributionRates: Array<{
      channelType: string;
      description: string;
      distributionRate: number;
    }>;
  }>,
): string[] => {
  const messages: string[] = [];

  const traverse = (obj: unknown, path: string = "") => {
    if (
      obj &&
      typeof obj === "object" &&
      "message" in obj &&
      typeof obj.message === "string"
    ) {
      messages.push(obj.message);
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (item && typeof item === "object") {
          traverse(item, path ? `${path}[${index}]` : `[${index}]`);
        }
      });
    } else if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key;
        traverse((obj as Record<string, unknown>)[key], newPath);
      });
    }
  };

  traverse(errors);
  return messages;
};

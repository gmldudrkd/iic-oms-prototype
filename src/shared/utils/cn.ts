// twmMerge is a custom function that merges tailwind classes
/**
 * 중복 클래스 제거, 동적 클래스 분리
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  const allClasses = clsx(inputs).split(" ");

  const dynamicClasses = allClasses.filter((cls) => cls.startsWith("text-"));
  const staticClasses = allClasses.filter((cls) => !cls.startsWith("text-"));

  const mergedStaticClasses = twMerge(staticClasses.join(" "));
  const dynamicClassString = dynamicClasses.join(" ");

  return `${mergedStaticClasses} ${dynamicClassString}`.trim();
}

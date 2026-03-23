import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  accessIp: z.string().min(1),
  userAgent: z.string().min(1),
});

export type LoginData = z.infer<typeof loginSchema>;

// 디바이스 정보 타입 정의
export interface DeviceInfo {
  userAgent: string;
  accessIp: string;
}

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { z } from "zod";

dayjs.extend(utc);
dayjs.extend(timezone);

export const timeToolSchema = z.object({
  timezone: z.string().optional().default("UTC").describe("IANA timezone (e.g., 'America/New_York', 'Europe/Paris', 'Asia/Tokyo')"),
});

export type TimeInput = z.infer<typeof timeToolSchema>;

export function getTime(input: TimeInput): string {
  const { timezone } = input;
  
  try {
    const now = dayjs().tz(timezone);
    const formatted = now.format("YYYY-MM-DD HH:mm:ss");
    const dayOfWeek = now.format("dddd");
    
    return `Current time in ${timezone}: ${formatted} (${dayOfWeek})`;
  } catch (error) {
    console.error("Time tool error:", error);
    return `Error getting time for timezone: ${timezone}. Please check the timezone name.`;
  }
}

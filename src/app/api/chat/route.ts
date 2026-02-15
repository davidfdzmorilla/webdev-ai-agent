import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";
import { z } from "zod";

const requestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = requestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { message, sessionId } = validation.data;
    
    // Generate session ID if not provided (simple cookie-based)
    const finalSessionId = sessionId || request.cookies.get("session_id")?.value || crypto.randomUUID();
    
    // Run agent
    const result = await runAgent({
      message,
      sessionId: finalSessionId,
    });
    
    // Set session cookie if new
    const response = NextResponse.json(result);
    if (!sessionId) {
      response.cookies.set("session_id", finalSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    
    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

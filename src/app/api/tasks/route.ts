import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session_id")?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "all";
    
    let taskList;
    
    if (status === "all") {
      taskList = await db.select().from(tasks).where(eq(tasks.sessionId, sessionId));
    } else {
      taskList = await db.select().from(tasks).where(and(
        eq(tasks.sessionId, sessionId),
        eq(tasks.status, status as "pending" | "completed")
      ));
    }
    
    return NextResponse.json({ tasks: taskList });
  } catch (error) {
    console.error("Tasks API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

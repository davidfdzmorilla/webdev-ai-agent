import { db } from "../db";
import { tasks, type Task } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Create Task Tool
export const createTaskToolSchema = z.object({
  title: z.string().describe("Task title"),
  description: z.string().optional().describe("Task description (optional)"),
  dueDate: z.string().optional().describe("Due date in YYYY-MM-DD format (optional)"),
  sessionId: z.string().describe("User session ID"),
});

export type CreateTaskInput = z.infer<typeof createTaskToolSchema>;

export async function createTask(input: CreateTaskInput): Promise<string> {
  const { title, description, dueDate, sessionId } = input;
  
  try {
    const [task] = await db.insert(tasks).values({
      sessionId,
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: "pending",
    }).returning();
    
    let message = `Created task: "${task.title}"`;
    if (task.dueDate) {
      message += ` (due: ${task.dueDate.toISOString().split('T')[0]})`;
    }
    
    return message;
  } catch (error) {
    console.error("Create task error:", error);
    return "Error creating task. Please try again.";
  }
}

// List Tasks Tool
export const listTasksToolSchema = z.object({
  sessionId: z.string().describe("User session ID"),
  status: z.enum(["all", "pending", "completed"]).optional().default("all").describe("Filter by status"),
  limit: z.number().optional().default(10).describe("Maximum number of tasks to return"),
});

export type ListTasksInput = z.infer<typeof listTasksToolSchema>;

export async function listTasks(input: ListTasksInput): Promise<string> {
  const { sessionId, status, limit } = input;
  
  try {
    let taskList;
    
    if (status === "all") {
      taskList = await db.select().from(tasks)
        .where(eq(tasks.sessionId, sessionId))
        .limit(limit);
    } else {
      taskList = await db.select().from(tasks)
        .where(and(
          eq(tasks.sessionId, sessionId),
          eq(tasks.status, status)
        ))
        .limit(limit);
    }
    
    if (taskList.length === 0) {
      return status === "all" 
        ? "You have no tasks." 
        : `You have no ${status} tasks.`;
    }
    
    const taskStrings = taskList.map((task, index) => {
      let str = `${index + 1}. ${task.title}`;
      if (task.description) {
        str += ` - ${task.description}`;
      }
      if (task.dueDate) {
        str += ` (due: ${task.dueDate.toISOString().split('T')[0]})`;
      }
      str += ` [${task.status}]`;
      return str;
    });
    
    return `Your tasks:\n${taskStrings.join('\n')}`;
  } catch (error) {
    console.error("List tasks error:", error);
    return "Error listing tasks. Please try again.";
  }
}

// Complete Task Tool
export const completeTaskToolSchema = z.object({
  taskId: z.string().describe("ID of the task to complete"),
  sessionId: z.string().describe("User session ID"),
});

export type CompleteTaskInput = z.infer<typeof completeTaskToolSchema>;

export async function completeTask(input: CompleteTaskInput): Promise<string> {
  const { taskId, sessionId } = input;
  
  try {
    const [task] = await db
      .update(tasks)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(and(
        eq(tasks.id, taskId),
        eq(tasks.sessionId, sessionId)
      ))
      .returning();
    
    if (!task) {
      return "Task not found or you don't have permission to complete it.";
    }
    
    return `Completed task: "${task.title}"`;
  } catch (error) {
    console.error("Complete task error:", error);
    return "Error completing task. Please try again.";
  }
}

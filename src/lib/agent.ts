import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { 
  getWeather, weatherToolSchema,
  calculator, calculatorToolSchema,
  getTime, timeToolSchema,
  createTask, createTaskToolSchema,
  listTasks, listTasksToolSchema,
  completeTask, completeTaskToolSchema,
} from "./tools";

export interface AgentInput {
  message: string;
  sessionId: string;
}

export interface AgentResponse {
  response: string;
  toolCalls?: Array<{
    tool: string;
    input: any;
    output: string;
  }>;
}

export async function runAgent(input: AgentInput): Promise<AgentResponse> {
  const { message, sessionId } = input;
  
  // Initialize OpenAI LLM
  const llm = new ChatOpenAI({
    model: "gpt-4-turbo-preview",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  // Define tools
  const tools = [
    new DynamicStructuredTool({
      name: "get_weather",
      description: "Get current weather information for a city",
      schema: weatherToolSchema,
      func: async (input) => {
        const result = await getWeather(input);
        return result;
      },
    }),
    new DynamicStructuredTool({
      name: "calculator",
      description: "Perform mathematical calculations. Supports basic operations, functions like sqrt, sin, cos, and more.",
      schema: calculatorToolSchema,
      func: async (input) => {
        const result = calculator(input);
        return result;
      },
    }),
    new DynamicStructuredTool({
      name: "get_time",
      description: "Get current date and time in a specific timezone",
      schema: timeToolSchema,
      func: async (input) => {
        const result = getTime(input);
        return result;
      },
    }),
    new DynamicStructuredTool({
      name: "create_task",
      description: "Create a new task for the user",
      schema: createTaskToolSchema,
      func: async (input) => {
        const result = await createTask({ ...input, sessionId });
        return result;
      },
    }),
    new DynamicStructuredTool({
      name: "list_tasks",
      description: "List user's tasks, optionally filtered by status",
      schema: listTasksToolSchema,
      func: async (input) => {
        const result = await listTasks({ ...input, sessionId });
        return result;
      },
    }),
    new DynamicStructuredTool({
      name: "complete_task",
      description: "Mark a task as completed",
      schema: completeTaskToolSchema,
      func: async (input) => {
        const result = await completeTask({ ...input, sessionId });
        return result;
      },
    }),
  ];
  
  // Create prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a helpful AI assistant with access to various tools.
    
You can:
- Check weather in any city (get_weather)
- Perform calculations (calculator)
- Get current time in any timezone (get_time)
- Manage tasks: create, list, and complete tasks

When a user asks about tasks, weather, calculations, or time, use the appropriate tool.
Always provide natural, conversational responses that incorporate the tool results.

Be helpful, concise, and friendly.`],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);
  
  // Create agent
  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt,
  });
  
  // Create agent executor
  const executor = new AgentExecutor({
    agent,
    tools,
    maxIterations: 5,
    verbose: false,
  });
  
  try {
    // Run agent
    const result = await executor.invoke({
      input: message,
    });
    
    return {
      response: result.output,
    };
  } catch (error) {
    console.error("Agent error:", error);
    return {
      response: "I encountered an error processing your request. Please try again.",
    };
  }
}

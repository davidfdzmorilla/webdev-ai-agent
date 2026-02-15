# DESIGN.md — AI Chatbot with Function Calling

## Project: webdev-ai-agent (Level 5.3)
**Version**: 1.0.0  
**Status**: Planning  
**Author**: WebDev Agent  
**Date**: 2026-02-15

---

## Problem Statement

Traditional chatbots can only provide text responses. Modern LLM agents can **take actions** by:
- Calling external APIs
- Querying databases
- Executing computations
- Updating state

**Example**:
```
❌ Basic Chatbot:
User: "What's the weather in Paris?"
Bot: "I don't have access to weather data"

✅ LLM Agent:
User: "What's the weather in Paris?"
Bot: [Calls get_weather("Paris")]
Bot: "It's 12°C and cloudy in Paris. You might need a jacket!"
```

This project demonstrates **OpenAI Function Calling** (now called "Tools") to build an agent that can:
1. Understand user intent
2. Decide which tools to use
3. Execute tools
4. Synthesize results into natural responses

---

## Architecture

### High-Level Flow
```
User Input
    ↓
[LLM with Tool Definitions]
    ↓
Decision: Use tool?
    │
    ├─ Yes → Execute Tool → Return to LLM → Final Response
    └─ No  → Direct Text Response
```

### Component Diagram
```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│                                                           │
│  ┌────────────┐          ┌────────────────────────┐    │
│  │   Chat UI  │  ◄─────► │  /api/chat (Agent API) │    │
│  └────────────┘          └───────────┬────────────┘    │
│       │                               │                  │
│       │                               ▼                  │
│  User Messages         ┌──────────────────────────┐    │
│                        │   Agent Loop (LangChain)  │    │
│                        │                           │    │
│                        │  1. Send message to LLM   │    │
│                        │  2. LLM decides tool use  │    │
│                        │  3. Execute tools         │    │
│                        │  4. Send results to LLM   │    │
│                        │  5. Get final response    │    │
│                        └───────────┬───────────────┘    │
│                                    │                     │
│                                    ▼                     │
│                        ┌───────────────────────┐        │
│                        │   TOOL REGISTRY       │        │
│                        │                       │        │
│                        │  - get_weather        │        │
│                        │  - create_task        │        │
│                        │  - list_tasks         │        │
│                        │  - complete_task      │        │
│                        │  - calculator         │        │
│                        │  - get_time           │        │
│                        └───────────┬───────────┘        │
│                                    │                     │
│                                    ▼                     │
│                        ┌───────────────────────┐        │
│                        │  External Services    │        │
│                        │                       │        │
│                        │  - OpenWeatherMap API │        │
│                        │  - PostgreSQL (tasks) │        │
│                        │  - Math.js            │        │
│                        └───────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## Tools (Functions)

### 1. Weather Tool
```typescript
{
  name: "get_weather",
  description: "Get current weather for a city",
  parameters: {
    type: "object",
    properties: {
      city: { type: "string", description: "City name (e.g., Paris, London)" },
      units: { type: "string", enum: ["metric", "imperial"], default: "metric" }
    },
    required: ["city"]
  }
}
```

**Implementation**: Call OpenWeatherMap API (free tier, no key required for basic features) or use wttr.in

---

### 2. Task Management Tools

#### create_task
```typescript
{
  name: "create_task",
  description: "Create a new task for the user",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "Task title" },
      description: { type: "string", description: "Task description (optional)" },
      due_date: { type: "string", description: "Due date (YYYY-MM-DD, optional)" }
    },
    required: ["title"]
  }
}
```

#### list_tasks
```typescript
{
  name: "list_tasks",
  description: "List user's tasks, optionally filtered",
  parameters: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["all", "pending", "completed"], default: "all" },
      limit: { type: "number", description: "Max number of tasks to return", default: 10 }
    }
  }
}
```

#### complete_task
```typescript
{
  name: "complete_task",
  description: "Mark a task as completed",
  parameters: {
    type: "object",
    properties: {
      task_id: { type: "string", description: "ID of the task to complete" }
    },
    required: ["task_id"]
  }
}
```

---

### 3. Calculator Tool
```typescript
{
  name: "calculator",
  description: "Perform mathematical calculations",
  parameters: {
    type: "object",
    properties: {
      expression: { type: "string", description: "Math expression to evaluate (e.g., '2 + 2', 'sqrt(16)', 'sin(pi/2)')" }
    },
    required: ["expression"]
  }
}
```

**Implementation**: Use `mathjs` library for safe expression evaluation

---

### 4. Time Tool
```typescript
{
  name: "get_time",
  description: "Get current date and time in a timezone",
  parameters: {
    type: "object",
    properties: {
      timezone: { type: "string", description: "IANA timezone (e.g., 'America/New_York', 'Europe/Paris')", default: "UTC" }
    }
  }
}
```

---

## Data Model

### Task Entity
```typescript
interface Task {
  id: string;           // UUID
  user_id: string;      // User identifier (session-based for demo)
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  due_date: Date | null;
  created_at: Date;
  completed_at: Date | null;
}
```

### Chat Message Entity
```typescript
interface ChatMessage {
  id: string;
  session_id: string;    // User session
  role: 'user' | 'assistant' | 'function';
  content: string;
  function_call?: {
    name: string;
    arguments: string;   // JSON string
  };
  created_at: Date;
}
```

---

## API Design

### POST /api/chat
**Purpose**: Send message to agent and get response

**Request**:
```json
{
  "message": "What's the weather in Paris?",
  "session_id": "optional-session-id"
}
```

**Response (streaming)**:
```
data: {"type":"function_call","function":"get_weather","arguments":{"city":"Paris"}}

data: {"type":"function_result","function":"get_weather","result":"12°C, cloudy"}

data: {"type":"message","content":"It's currently 12°C and cloudy in Paris. You might want to bring a jacket!"}

data: [DONE]
```

---

### GET /api/tasks
**Purpose**: List user's tasks

**Query Params**:
- `session_id`: string (required)
- `status`: "all" | "pending" | "completed" (optional, default: "all")

**Response**:
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "description": null,
      "status": "pending",
      "due_date": "2026-02-16",
      "created_at": "2026-02-15T04:00:00Z"
    }
  ]
}
```

---

## Tech Stack

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **LLM**: OpenAI GPT-4-turbo (function calling)
- **Agent Framework**: LangChain.js (optional, or custom implementation)

### Data & Services
- **Database**: PostgreSQL 17 (tasks storage)
- **ORM**: Drizzle ORM
- **Weather API**: wttr.in (no key required) or OpenWeatherMap
- **Math**: mathjs

### Frontend
- **UI**: Tailwind CSS 4
- **Streaming**: Server-Sent Events (SSE)
- **State**: React hooks

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **DNS**: Cloudflare (agent.davidfdzmorilla.dev)

---

## Agent Loop Implementation

### Option 1: LangChain.js (Recommended)
```typescript
import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

const tools = [
  new DynamicTool({
    name: "get_weather",
    description: "Get current weather for a city",
    func: async (city: string) => {
      const response = await fetch(`https://wttr.in/${city}?format=j1`);
      const data = await response.json();
      return `${data.current_condition[0].temp_C}°C, ${data.current_condition[0].weatherDesc[0].value}`;
    }
  }),
  // ... more tools
];

const llm = new ChatOpenAI({ model: "gpt-4-turbo", temperature: 0.7 });
const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });
const executor = new AgentExecutor({ agent, tools });

const result = await executor.invoke({ input: userMessage });
```

### Option 2: Custom Implementation (More Control)
```typescript
async function runAgent(messages: ChatMessage[]): Promise<string> {
  const MAX_ITERATIONS = 5;
  let iteration = 0;

  while (iteration < MAX_ITERATIONS) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      tools: toolDefinitions,
      tool_choice: "auto"
    });

    const message = response.choices[0].message;

    // No tool call → return final response
    if (!message.tool_calls) {
      return message.content;
    }

    // Execute each tool call
    for (const toolCall of message.tool_calls) {
      const toolResult = await executeTool(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments)
      );

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult)
      });
    }

    iteration++;
  }

  return "Maximum iterations reached";
}
```

---

## Conversation Examples

### Example 1: Weather Query
```
User: "What's the weather like in London?"

[LLM decides to call get_weather]
Tool Call: get_weather({ city: "London" })
Tool Result: { temp: "8°C", condition: "rainy" }
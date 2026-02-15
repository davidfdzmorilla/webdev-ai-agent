# AI Agent with Function Calling

AI chatbot demonstrating OpenAI function calling (Tools API) with LangChain. The agent can execute tools like weather lookup, calculator, time zones, and task management.

**🌐 Live**: [https://agent.davidfdzmorilla.dev](https://agent.davidfdzmorilla.dev) (coming soon)  
**📦 Repo**: [github.com/davidfdzmorilla/webdev-ai-agent](https://github.com/davidfdzmorilla/webdev-ai-agent)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **LLM**: OpenAI GPT-4-turbo (function calling)
- **Agent**: LangChain.js
- **Database**: PostgreSQL 17 + Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Infrastructure**: Docker, Nginx, Cloudflare

## Features

- 🤖 **Conversational AI**: Natural language interaction with GPT-4
- 🛠️ **Function Calling**: Agent can execute tools autonomously
- 🌤️ **Weather Tool**: Get current weather for any city
- 🧮 **Calculator**: Perform mathematical calculations
- ⏰ **Time Tool**: Get time in any timezone
- ✅ **Task Management**: Create, list, and complete tasks via conversation
- 💬 **Streaming Responses**: Server-Sent Events for real-time feedback
- 📦 **Persistent Storage**: Tasks saved to PostgreSQL

## Architecture

```
User Input → LLM (GPT-4) → Decides tool use
                ↓
         Execute Tool → Return result
                ↓
         LLM synthesizes → Final response
```

### Tools Available

1. **get_weather**: Current weather via wttr.in API
2. **calculator**: Math expressions via mathjs
3. **get_time**: Current time in any timezone
4. **create_task**: Add task to database
5. **list_tasks**: List user's tasks (filtered)
6. **complete_task**: Mark task as done

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm
- Docker (for production)
- OpenAI API key

### Development

1. Clone and install:
```bash
git clone https://github.com/davidfdzmorilla/webdev-ai-agent.git
cd webdev-ai-agent
pnpm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

3. Start database:
```bash
docker compose up postgres -d
pnpm db:generate
pnpm db:migrate
```

4. Run dev server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production (Docker)

```bash
docker compose up -d
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Chat API (streaming)
│   │   └── tasks/route.ts       # Tasks API
│   ├── page.tsx                 # Chat UI
│   └── layout.tsx
├── lib/
│   ├── agent.ts                 # Agent loop (LangChain)
│   ├── tools/                   # Tool implementations
│   │   ├── weather.ts
│   │   ├── calculator.ts
│   │   ├── time.ts
│   │   └── tasks.ts
│   └── db/
│       ├── schema.ts            # Drizzle schema
│       └── index.ts             # DB client
└── components/
    ├── ChatInterface.tsx
    └── TaskSidebar.tsx
```

## Conversation Examples

### Weather Query
```
User: "What's the weather in London?"
Agent: [Calls get_weather("London")]
Agent: "It's 8°C and rainy in London. You might want an umbrella!"
```

### Task Management
```
User: "Remind me to buy groceries tomorrow"
Agent: [Calls create_task("Buy groceries", due: tomorrow)]
Agent: "Done! I've added 'Buy groceries' to your tasks for tomorrow."

User: "What do I need to do?"
Agent: [Calls list_tasks(status: "pending")]
Agent: "You have 3 pending tasks: 1. Buy groceries (due tomorrow) 2. ..."
```

### Calculator
```
User: "What's 15% of 450?"
Agent: [Calls calculator("450 * 0.15")]
Agent: "15% of 450 is 67.5"
```

## Documentation

- [Design Document](docs/DESIGN.md) — Architecture, tools, data model
- [Roadmap](docs/ROADMAP.md) — Milestones and tasks
- [Verification Report](docs/VERIFICATION.md) — Deployment verification (coming soon)

## Development

### Run Tests
```bash
pnpm test
```

### Lint & Type Check
```bash
pnpm lint
pnpm type-check
```

### Database Migrations
```bash
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Apply migrations
pnpm db:studio    # Open Drizzle Studio
```

## Deployment

1. Build Docker image:
```bash
docker build -t webdev-ai-agent .
```

2. Deploy with docker compose:
```bash
docker compose up -d
```

3. Configure DNS (Cloudflare):
```bash
# Create A record for agent.davidfdzmorilla.dev → SERVER_IP
```

4. Configure Nginx reverse proxy (port 3009)

5. Request SSL certificate:
```bash
certbot --nginx -d agent.davidfdzmorilla.dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret for session cookies | Yes |

## License

MIT

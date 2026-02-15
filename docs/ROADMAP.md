# ROADMAP.md — AI Chatbot with Function Calling

## Project: webdev-ai-agent (Level 5.3)
**Status**: In Progress  
**Started**: 2026-02-15  
**Target Completion**: 2026-02-15

---

## Milestones

### M1: Project Setup ✅ (Complete)
**Duration**: 30 minutes  
**Status**: ✅ Complete

- [x] Create project directory structure
- [x] Write DESIGN.md (architecture, tools, data model, API design)
- [x] Write ROADMAP.md (this document)
- [ ] Initialize Git repository
- [ ] Create GitHub repo (github.com/davidfdzmorilla/webdev-ai-agent)
- [ ] Scaffold Next.js 15 project with TypeScript
- [ ] Setup Docker + docker-compose.yml
- [ ] Configure Drizzle ORM + PostgreSQL schema

**Deliverable**: Initialized project with documentation and scaffolding

---

### M2: Core Agent Loop
**Duration**: 1-2 hours  
**Status**: ⏳ Pending

**Tasks**:
- [ ] Install dependencies (@langchain/openai, langchain, mathjs, drizzle-orm)
- [ ] Create database schema (tasks, messages tables)
- [ ] Implement agent loop (src/lib/agent.ts)
  - [ ] OpenAI client setup
  - [ ] Tool definitions
  - [ ] Agent executor with max iterations
  - [ ] Error handling and logging
- [ ] Create tool executors (src/lib/tools/)
  - [ ] get_weather (wttr.in API)
  - [ ] calculator (mathjs)
  - [ ] get_time (dayjs with timezone support)
- [ ] Write unit tests for agent loop
- [ ] Write unit tests for tools

**Deliverable**: Functional agent that can call tools and synthesize responses

**Acceptance Criteria**:
- Agent loop runs without errors
- Can call weather tool and return formatted response
- Can perform calculations correctly
- Can get time in different timezones
- All tests pass (coverage ≥80%)

---

### M3: Task Management Tools
**Duration**: 1 hour  
**Status**: ⏳ Pending

**Tasks**:
- [ ] Implement task database operations (src/lib/db/tasks.ts)
  - [ ] createTask(title, description, due_date)
  - [ ] listTasks(session_id, status, limit)
  - [ ] completeTask(task_id)
  - [ ] deleteTask(task_id)
- [ ] Create task tool executors (src/lib/tools/tasks.ts)
  - [ ] create_task
  - [ ] list_tasks
  - [ ] complete_task
- [ ] Write integration tests for task tools
- [ ] Add task tools to agent tool registry

**Deliverable**: Agent can manage tasks via conversation

**Acceptance Criteria**:
- User can create tasks via natural language
- Agent can list and filter tasks
- Agent can mark tasks as complete
- All task operations persist to database

---

### M4: Chat API + Streaming
**Duration**: 1-2 hours  
**Status**: ⏳ Pending

**Tasks**:
- [ ] Create POST /api/chat route (app/api/chat/route.ts)
  - [ ] Accept message + session_id
  - [ ] Call agent loop
  - [ ] Stream responses via Server-Sent Events
  - [ ] Include function call events in stream
- [ ] Create GET /api/tasks route
  - [ ] List tasks for session
  - [ ] Filter by status
- [ ] Session management (cookie-based session IDs)
- [ ] Rate limiting (10 requests/minute per session)
- [ ] Error handling and validation
- [ ] API tests (integration)

**Deliverable**: RESTful API for chat and task management

**Acceptance Criteria**:
- POST /api/chat returns streamed responses
- Function calls visible in stream
- GET /api/tasks returns correct task list
- Rate limiting prevents abuse
- All API tests pass

---

### M5: Frontend UI
**Duration**: 2-3 hours  
**Status**: ⏳ Pending

**Tasks**:
- [ ] Create chat interface (app/page.tsx)
  - [ ] Message list (user + assistant messages)
  - [ ] Input field with submit
  - [ ] Loading states
  - [ ] Function call indicators
  - [ ] Error messages
- [ ] Task sidebar (app/components/TaskSidebar.tsx)
  - [ ] List pending tasks
  - [ ] List completed tasks
  - [ ] Task count badges
  - [ ] Click to complete
- [ ] Styling with Tailwind CSS 4
  - [ ] Responsive design (mobile-first)
  - [ ] Dark mode support
  - [ ] Smooth animations
- [ ] SSE client for streaming
  - [ ] Handle streamed messages
  - [ ] Parse function call events
  - [ ] Auto-scroll to bottom
- [ ] Accessibility (WCAG 2.1 AA)
  - [ ] Keyboard navigation
  - [ ] ARIA labels
  - [ ] Focus management

**Deliverable**: Polished chat interface with task sidebar

**Acceptance Criteria**:
- Users can send messages and see responses
- Function calls visible during execution
- Tasks appear in sidebar automatically
- UI is responsive on mobile/tablet/desktop
- Lighthouse Accessibility ≥90

---

### M6: Observability + Error Handling
**Duration**: 1 hour  
**Status**: ⏳ Pending

**Tasks**:
- [ ] Add structured logging (pino)
  - [ ] Log all agent decisions
  - [ ] Log tool executions
  - [ ] Log API requests
- [ ] Error boundary (app/error.tsx)
- [ ] Graceful degradation
  - [ ] Handle OpenAI API failures
  - [ ] Handle tool failures
  - [ ] Handle database failures
- [ ] User-friendly error messages
- [ ] Health check endpoint (GET /api/health)

**Deliverable**: Production-ready error handling and logging

**Acceptance Criteria**:
- All errors logged with context
- Users see helpful error messages (not stack traces)
- Agent continues on tool failures (doesn't crash)
- Health check returns service status

---

### M7: Containerization + Deployment
**Duration**: 1 hour  
**Status**: ⏳ Pending

**Tasks**:
- [ ] Write Dockerfile (multi-stage)
  - [ ] Build stage (pnpm build)
  - [ ] Production stage (minimal image)
- [ ] Update docker-compose.yml
  - [ ] App container (port 3009:3000)
  - [ ] PostgreSQL 17 (port 5435:5432)
  - [ ] Health checks
  - [ ] Volumes for persistence
- [ ] Environment variables (.env.example)
  - [ ] OPENAI_API_KEY
  - [ ] DATABASE_URL
  - [ ] SESSION_SECRET
- [ ] Build and test locally
- [ ] Configure Cloudflare DNS (agent.davidfdzmorilla.dev)
- [ ] Configure Nginx reverse proxy
- [ ] Deploy to server
- [ ] Request SSL certificate (certbot)

**Deliverable**: Deployed application at https://agent.davidfdzmorilla.dev

**Acceptance Criteria**:
- Docker containers start without errors
- Application accessible at agent.davidfdzmorilla.dev
- HTTPS works (valid SSL)
- Database persists after restarts

---

### M8: Verification + Documentation
**Duration**: 30 minutes  
**Status**: ⏳ Pending

**Tasks**:
- [ ] Run full verification checklist (SOUL.md Phase 6)
  - [ ] DNS & SSL verification
  - [ ] Application verification (all routes return 200)
  - [ ] Docker verification (healthy, clean logs, survives restart)
  - [ ] Git verification (clean tree, README complete)
  - [ ] Performance verification (Lighthouse if accessible)
- [ ] Create docs/VERIFICATION.md
- [ ] Update PROGRESS.json (status: complete, verified: true)
- [ ] Update portfolio (add webdev-ai-agent project)
- [ ] Write final README.md
- [ ] Commit and push all changes

**Deliverable**: Verified, documented, production-ready application

**Acceptance Criteria**:
- All verification checks pass
- docs/VERIFICATION.md exists with detailed report
- README complete with setup instructions
- Portfolio updated with project link
- PROGRESS.json marked complete

---

## Success Criteria

### Functional Requirements
- ✅ Agent can understand natural language requests
- ✅ Agent can call 6 tools (weather, calculator, time, create_task, list_tasks, complete_task)
- ✅ Agent provides natural, conversational responses
- ✅ Tool results synthesized into answers
- ✅ Tasks persist to database
- ✅ Multi-turn conversations supported

### Technical Requirements
- ✅ TypeScript strict mode, zero errors
- ✅ ESLint passes with zero warnings
- ✅ All tests pass (unit + integration)
- ✅ Code coverage ≥80%
- ✅ Docker builds successfully
- ✅ Deployed with HTTPS
- ✅ Accessible at agent.davidfdzmorilla.dev

### Quality Requirements
- ✅ Lighthouse Performance ≥80 (if accessible)
- ✅ Lighthouse Accessibility ≥90
- ✅ No console errors in browser
- ✅ Clean container logs (no errors/warnings)
- ✅ Graceful error handling (no crashes)

---

## Timeline

**Estimated Total**: 8-10 hours  
**Target Completion**: 2026-02-15 EOD

| Milestone | Duration | Status |
|-----------|----------|--------|
| M1: Project Setup | 30 min | ✅ Complete |
| M2: Core Agent Loop | 1-2 hours | ⏳ Pending |
| M3: Task Management Tools | 1 hour | ⏳ Pending |
| M4: Chat API + Streaming | 1-2 hours | ⏳ Pending |
| M5: Frontend UI | 2-3 hours | ⏳ Pending |
| M6: Observability | 1 hour | ⏳ Pending |
| M7: Deployment | 1 hour | ⏳ Pending |
| M8: Verification | 30 min | ⏳ Pending |

---

## Risks & Mitigation

### Risk: OpenAI API Rate Limits
**Mitigation**: Implement exponential backoff, cache responses where possible, use gpt-4-turbo-preview (higher limits)

### Risk: Tool Execution Failures
**Mitigation**: Wrap all tool calls in try/catch, return error messages to LLM, let LLM decide how to proceed

### Risk: Infinite Agent Loops
**Mitigation**: Set MAX_ITERATIONS=5, timeout after 30 seconds, log all iterations

### Risk: Cloudflare Bot Protection (same as previous projects)
**Mitigation**: Accept that automated checks may fail, verify manually via browser

---

## Notes

- This is Level 5.3 (final project in AI/ML Engineering level)
- After completion + verification, generate Level 6 proposal
- Focus on demonstrating OpenAI function calling (now "Tools") properly
- Keep domain simple (tasks/weather/calc) to focus on agent mechanics
- Prioritize working implementation over feature completeness

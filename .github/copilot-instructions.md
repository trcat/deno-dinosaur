# Deno Dinosaur API - AI Coding Agent Instructions

## Project Overview
REST API built with Deno and Hono framework that serves dinosaur data and provides a Todo CRUD API using Deno KV (key-value store).

**Deployment**: Deno Deploy  
**Frontend**: GitHub Pages at `https://trcat.github.io/`

## Tech Stack & Key Dependencies
- **Runtime**: Deno (requires `--unstable` flag for KV features)
- **Framework**: Hono (imported from `https://deno.land/x/hono/mod.ts`)
- **Database**: Deno KV (unstable feature, requires `/// <reference lib="deno.unstable" />`)
- **Data**: Static dinosaur dataset in [data.json](../data.json) (~3000+ entries)

## Running the Project
```bash
# Start the server
deno task start
# Equivalent to: deno run -A --unstable main.ts
```

## Architecture & Key Files

### [main.ts](../main.ts) - Main Application
- Hono app with CORS configured for specific origins
- **Dinosaur API**: `/api` and `/api/:dinosaur` - Serves static dinosaur data
- **Todo CRUD API**: `/todo/*` - Full CRUD operations backed by Deno KV
  - GET `/todo` - List all todos
  - POST `/todo` - Create todo (auto-generates `todo_${timestamp}` IDs)
  - PUT `/todo/:id` - Update todo by ID
  - DELETE `/todo/:id` - Delete todo by ID

### [kv.ts](../kv.ts)
Example/reference code showing Deno KV basic usage patterns (not imported by main app).

## Project-Specific Patterns

### CORS Configuration
```typescript
origin: (origin: string) => {
  return origin.indexOf("https://trcat.github.io/") ? origin : 'http://localhost:5173/'
}
```
- **Production**: Frontend hosted on GitHub Pages at `https://trcat.github.io/`
- **Development**: Local dev server at `http://localhost:5173/`

### Deno KV Key Structure
- Todos use composite keys: `["todo", id]`
- IDs generated as `todo_${Date.now()}`
- List todos using prefix: `kv.list({ prefix: ["todo"] })`

### Import Patterns
- Use Deno CDN imports: `https://deno.land/x/...`
- JSON imports use `with` keyword: `import data from "./data.json" with { type: "json" }`
- Always include `/// <reference lib="deno.unstable" />` when using KV
Deployment
- **Platform**: Deno Deploy (automatically deploys from this repo)
- **Deno KV**: Persists data across deployments on Deno Deploy
- **Entry Point**: [main.ts](../main.ts) uses `Deno.serve()` for deployment compatibility

## Common Tasks
- **Add new routes**: Follow Hono pattern in [main.ts](../main.ts), use `app.get|post|put|delete(path, handler)`
- **Modify dinosaur data**: Edit [data.json](../data.json) directly (large file with 3000+ entries)
- **KV operations**: Reference [kv.ts](../kv.ts) for patterns, use `kv.set()`, `kv.get()`, `kv.delete()`, `kv.list()`
- **Test locally**: Run `deno task start` before pushing to Deno Deploy
- **KV operations**: Reference [kv.ts](../kv.ts) for patterns, use `kv.set()`, `kv.get()`, `kv.delete()`, `kv.list()`

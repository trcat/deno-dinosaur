/// <reference lib="deno.unstable" />
import { Hono, type Context } from "https://deno.land/x/hono/mod.ts"
import { cors } from "https://deno.land/x/hono/middleware.ts"
import data from "./data.json" with { type: "json" }

const app = new Hono()
app.use(
  "/todo/*",
  cors({
    origin: (origin: string) => {
      return origin.indexOf("https://trcat.github.io/") ? origin : 'http://localhost:5173/'
    },
  })
)
const kv = await Deno.openKv()

app.get("/", (c: Context) => {
  return c.json("Welcome to dinosaur API!")
})

app.get("/api", (c: Context) => {
  return c.json(data)
})

app.get("/api/:dinosaur", (c: Context) => {
  const dinosaur = c.req.param("dinosaur")

  if (dinosaur) {
    const found = data.find(
      (item) => item.name.toLowerCase() === dinosaur.toLowerCase()
    )
    if (found) {
      return c.json(found)
    } else {
      return c.json("No dinosaurs found.")
    }
  } else {
    return c.json("No dinosaurs found.")
  }
})

/**
 * 获取所有待办事项
 */
app.get("/todo", async (c: Context) => {
  const iter = await kv.list({ prefix: ["todo"] })
  const todo = []
  for await (const res of iter) todo.push(res)
  return c.json(todo)
})

/**
 * 创建待办事项
 */
app.post("/todo", async (c: Context) => {
  const body = await c.req.json()
  const id = `todo_${Date.now()}`
  const result = await kv.set(["todo", id], Object.assign(body, { id }))
  return c.json(result)
})

/**
 * 修改待办事项
 */
app.put("/todo/:id", async (c: Context) => {
  const id = c.req.param("id")
  const body = await c.req.json()
  const result = await kv.set(["todo", id], body)
  return c.json(result)
})

/**
 * 删除待办事项
 */
app.delete("/todo/:id", async (c: Context) => {
  const id = c.req.param("id")
  await kv.delete(["todo", id])
  return c.json('删除成功')
})

Deno.serve(app.fetch)

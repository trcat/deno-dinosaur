import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts"

import data from "./data.json" assert { type: "json" }

const app = new Hono()
const kv = await Deno.openKv()

app.get("/", (c) => {
  return c.json("Welcome to dinosaur API!")
})

app.get("/api", (c) => {
  return c.json(data)
})

app.get("/api/:dinosaur", (c) => {
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
app.get("/todo", async (c) => {
  const iter = await kv.list({ prefix: ["todo"] })
  const todo = []
  for await (const res of iter) todo.push(res)

  return c.json(todo)
})

/**
 * 创建待办事项
 */
app.post("/todo", async (c) => {
  const body = await c.req.json()
  const id = `todo_${Date.now()}`
  const result = await kv.set(["todo", id], Object.assign(body, { id }))
  return c.json(result)
})

/**
 * 修改待办事项
 */
app.put("/todo/:id", async (c) => {
  const id = c.req.param("id")
  const result = await kv.set(["todo", id], await c.req.json())
  return c.json(result)
})

/**
 * 删除待办事项
 */
app.delete("/todo/:id", async (c) => {
  const id = c.req.param("id")
  await kv.delete(["todo", id])
  return c.text("删除成功")
})

Deno.serve(app.fetch)

import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts"
import data from "./data.json" assert { type: "json" }

const app = new Hono()
// const kv = await Deno.openKv();

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

Deno.serve(app.fetch)

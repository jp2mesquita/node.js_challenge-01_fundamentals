import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes =  [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query


      const tasks = database.select('tasks', search 
        ? 
          {
            title: search,
            description: search,
          }
        : null
      )

      return res
      .end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },

]
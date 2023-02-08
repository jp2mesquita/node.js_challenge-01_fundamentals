import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes =  [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if(!title){
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title is required'})
        )
      }

      if(!description){
        return res.writeHead(400).end(
          JSON.stringify({ message: 'description is required'})
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null
      }

      try {
        database.insert('tasks', task)
        
        return res.writeHead(201).end()
      } catch (error) {
        console.log(error)
        return res.writeHead(400).end(
          JSON.stringify({ message: 'It was not possible to add a new task, please try again later'})
        )
      }

      
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      try {
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
      } catch (error) {
        console.log(error)
        return res.writeHead(400).end(
          JSON.stringify({message: 'It was not possible to load the tasks'})
        )
      }
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      
      const { id  } = req.params
      const { title , description } = req.body

      if(!title && !description){
        return res.writeHead(400).end(
          JSON.stringify({ message: 'Inform title or description'})
        )
      }

      try {
        database.update('tasks', id, title, description)

        return res.writeHead(204).end()
      } catch (error) {
        console.log(error)
        return res.writeHead(400).end(
          JSON.stringify({ message: 'It was not possible to update this task.'})
        )
      }
      
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      
      const { id  } = req.params

      try {
        database.toggleStatus('tasks', id)
      } catch (error) {
        console.log(error)
        return res.writeHead(400).end(
          JSON.stringify({ message: 'It was not possible to update this task status'})
        )
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      
      const { id } = req.params

      try {
        database.delete('tasks', id)

       return res.writeHead(204).end()
      } catch (error) {
        console.log(error)

        return res.writeHead(400).end(
          JSON.stringify({ message: 'It was not possible to delete this task.'})
        )
      }
      
    }
  },

]
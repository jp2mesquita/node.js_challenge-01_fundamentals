import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor () {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value)
        })
      })
    }

    return data
  }

  insert(table, data) {
    if  (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, title, description) {
    const taskToUpdateIndex = this.#database[table].findIndex(row => row.id === id)

    if (taskToUpdateIndex > -1) {
      const newTask = {
        title: title ? title : this.#database[table][taskToUpdateIndex].title,
        description: description ? description : this.#database[table][taskToUpdateIndex].description,
        updated_at: new Date()
      }
      const previousInfo = this.#database[table][taskToUpdateIndex]
      this.#database[table][taskToUpdateIndex] = {  ...previousInfo, ...newTask}
      this.#persist()
    }
  }

  toggleStatus(table, id) {
    const taskToToggleIndex = this.#database[table].findIndex(row => row.id === id)

    if (taskToToggleIndex > -1) {
      const newCompleted_at = 
        this.#database[table][taskToToggleIndex].completed_at
          ? null 
          : new Date()
      const newStatus = {
        completed_at: newCompleted_at,
        updated_at: new Date()
      }
      const previousInfo = this.#database[table][taskToToggleIndex]
      this.#database[table][taskToToggleIndex] = { ...previousInfo, ...newStatus }
    }
  }

  delete(table, id) {
    const taskToDeleteIndex = this.#database[table].findIndex(row => row.id === id)

    if ( taskToDeleteIndex > -1) {
      this.#database[table].splice(taskToDeleteIndex, 1)
      this.#persist()
    } else {
      throw (error) => {
        console.log(error)
      }
    }
  }
  
}
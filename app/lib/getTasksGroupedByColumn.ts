import axios from 'axios'

type BoardResponse = Record<string, Column>

type Column = {
  id: string
  tasks: TaskResponse[]
}

interface TaskResponse {
  id: string
  title: string
  status: string
  column: string
}

const transform = (task: any): TaskResponse => {
  return {
    id: task._id,
    title: task.title,
    status: task.status,
    column: task.column,
  }
}

const convert = (obj: BoardResponse) => {
  const map = new Map<string, Column>()
  for (const [k, v] of Object.entries(obj)) {
    const col: Column = {
      id: v.id,
      tasks: v.tasks.map(transform),
    }
    map.set(k, v)
  }
  return map
}

export const getTasksGroupedByColumn = async (apiEndpoint: string) => {
  try {
    // Fetch data from the API
    const response = await axios.get<BoardResponse>(apiEndpoint)
    const columns = response.data

    const board = {
      columns: convert(columns),
    }
    return board
  } catch (error) {
    console.log(error)
    // Todo: handle errors appropriately
    throw new Error('Failed to fetch data from the API')
  }
}

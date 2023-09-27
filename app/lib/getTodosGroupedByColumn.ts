import axios from 'axios'

interface BoardResponse {
  [key: string]: {
    title: string
    items: TodoResponse[]
  }
}

interface TodoResponse {
  id: string
  title: string
  status: string
}

export const getTodosGroupedByColumn = async (apiEndpoint: string) => {
  try {
    // Fetch data from the API
    const response = await axios.get<BoardResponse>(apiEndpoint)
    const tasks = response.data

    // Initialize an empty Map for columns
    const columns = new Map<TypedColumn, Column>()

    // Map the tasks data to the columns Map
    for (const columnType of Object.keys(tasks)) {
      const columnData = tasks[columnType]

      // Use the TodoResponse interface as the type for (item)
      const todos = columnData.items.map((item: TodoResponse) => ({
        id: item.id,
        title: item.title,
        status: item.status as TypedColumn,
      }))

      columns.set(columnType as TypedColumn, {
        id: columnType as TypedColumn,
        todos: todos,
      })
    }

    // Define the order of columns
    const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done']

    // Create the sortedColumns map and filter out undefined values
    const sortedColumns = new Map(
      columnTypes
        .map((columnType) => {
          const column = columns.get(columnType)
          if (column) {
            return [columnType, column]
          }
          return undefined
        })
        .filter((entry) => entry !== undefined) as [TypedColumn, Column][]
    )

    // Create the board object
    const board: Board = {
      columns: sortedColumns,
    }

    return board
  } catch (error) {
    // Todo: handle errors appropriately
    throw new Error('Failed to fetch data from the API')
  }
}

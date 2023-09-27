import axios from 'axios'

// Define a function for fetching data from the API
async function getTasks(apiEndpoint: string): Promise<any> {
  try {
    const response = await axios.get('http://localhost:4000/api/v1/todo')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch data from the API')
  }
}

export const getTodosGroupedByColumn = async (apiEndpoint: string) => {
  try {
    // Fetch data from the API
    const tasks = await getTasks('http://localhost:4000/api/v1/todo')

    // Initialize an empty Map for columns
    const columns = new Map<TypedColumn, Column>()

    // Map the tasks data to the columns Map
    for (const columnType of Object.keys(tasks)) {
      const columnData = tasks[columnType]

      // Use the TodoItem interface as the type for (item)
      const todos = columnData.items.map((item: Todo) => ({
        id: item.id,
        title: item.title,
        status: columnType as TypedColumn, // Use columnType as status
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
  } catch (error: any) {
    // TODO: error handling
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('An unknown error occurred')
    }
  }
}

// export const getTodosGroupedByColumn = () => {
//   const todos = [
//     { title: 'tip run', status: 'todo' as TypedColumn, id: '0' },
//     { title: 'feed dog', status: 'done' as TypedColumn, id: '1' },
//     { title: 'cook tea', status: 'inprogress' as TypedColumn, id: '2' },
//     { title: 'mop floors', status: 'todo' as TypedColumn, id: '3' },
//   ]

//   console.log(todos)

//   const columns = todos.reduce((acc, todo) => {
//     if (!acc.get(todo.status)) {
//       acc.set(todo.status, {
//         id: todo.status,
//         todos: [],
//       })
//     }

//     acc.get(todo.status)!.todos.push({
//       title: todo.title,
//       status: todo.status,
//       id: todo.id,
//     })
//     return acc
//   }, new Map<TypedColumn, Column>())

//   const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done']

//   for (const columnType of columnTypes) {
//     if (!columns.get(columnType)) {
//       columns.set(columnType, {
//         id: columnType,
//         todos: [],
//       })
//     }
//   }

//   console.log('columns', columns)

//   const sortedColumns = new Map(
//     Array.from(columns.entries()).sort(
//       (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
//     )
//   )

//   console.log('sorted', sortedColumns)

//   const board: Board = {
//     columns: sortedColumns,
//   }

//   return board
// }

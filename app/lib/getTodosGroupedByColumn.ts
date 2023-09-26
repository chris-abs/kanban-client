export const getTodosGroupedByColumn = async () => {
  const todos = [
    { title: 'tip run', status: 'todo' as TypedColumn, id: '0' },
    { title: 'feed dog', status: 'done' as TypedColumn, id: '1' },
    { title: 'cook tea', status: 'inprogress' as TypedColumn, id: '2' },
    { title: 'mop floors', status: 'todo' as TypedColumn, id: '3' },
  ]

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      })
    }

    acc.get(todo.status)!.todos.push({
      title: todo.title,
      status: todo.status,
      id: todo.id,
    })
    return acc
  }, new Map<TypedColumn, Column>())

  console.log(columns)

  const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done']

  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  )

  const board: Board = {
    columns: sortedColumns,
  }

  return board
}

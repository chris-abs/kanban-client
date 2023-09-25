interface Board {
  columns: Map<TypedColumn, Column>
}

type TypedColumn = 'todo' | 'inprogress' | 'done'

interface Column {
  id: TypedColumn
  todos: Todo[]
}

interface Todo {
  id: string
  createdAt: string
  title: string
  status: string
  // TODO: add ability to attach images to todos
  // image: string,
}

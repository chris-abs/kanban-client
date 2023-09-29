interface Board {
  columns: Map<string, Column>
}

interface Column {
  id: string
  name: string
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  status: string
}

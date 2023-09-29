import { create } from 'zustand'
import { getTasksGroupedByColumn } from '../lib/getTasksGroupedByColumn'
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000')

type CreateTask = {
  columnId: string
  status: string
  title: string
}

type SelectedCol = {
  status: string
  id: string
}

type ColumnUpdated = {
  taskId: string
  sourceCol: {
    id: string
    name: string
  }
  finishedCol: {
    id: string
    name: string
  }
}

interface BoardState {
  board: Board
  selectedCol: SelectedCol
  newTaskInput: string
  newTaskType: string

  getBoard: () => void
  setBoardState: (board: Board) => void
  taskMovedToNewColumn: (event: ColumnUpdated) => void
  updateTaskInDB: (task: Task, columnId: string) => void
  setupListeners: () => void
  addTask: (data: CreateTask) => void
  deleteTask: (id: string, column: string) => void

  setSelectedCol: (data: SelectedCol) => void
  setNewTaskInput: (input: string) => void
  setNewTaskType: (columnId: string) => void
}

const useBoardStore = create<BoardState>((set, get) => ({
  newTaskInput: '',
  newTaskType: 'todo',
  selectedCol: { id: '', status: '' },
  board: {
    columns: new Map<string, Column>(),
  },

  setupListeners: () => {
    socket.on('taskCreated', (data: Task) => {
      const board = get().board
      let column = board.columns.get(data.status)
      column?.tasks.push(data)
      if (column && data.status) {
        board.columns.set(data.status, column)
        set({ board: board })
      }
    })
    socket.on(
      'taskDeleted',
      ({ id, columnId, ...rest }: { id: string; columnId: string }) => {
        const board = get().board
        let column = board.columns.get(columnId)
        if (!column) {
          return
        }
        let tasks = column?.tasks.filter((task) => task.id !== id)
        column.tasks = tasks
        board.columns.set(column.id, column)
        set({ board: board })
      }
    )
  },

  taskMovedToNewColumn: (event: ColumnUpdated) => {
    socket.emit('columnUpdates', event)
  },

  addTask: (data: CreateTask) => {
    try {
      socket.emit(
        'createTask',
        { column: data.columnId, status: data.status, title: data.title },
        (response: any) => {
          console.log('Response from server:', response)
        }
      )
    } catch (error: any) {
      // Handle the error here (e.g., logging or showing an error message)
      console.error('Failed to add task:', error.message)
    }
  },

  getBoard: async () => {
    try {
      const board = await getTasksGroupedByColumn(
        'http://localhost:4000/api/v1/tasks'
      )
      set({ board })
    } catch (error: any) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
      } else {
        console.error('An unknown error occurred')
      }
    }
  },

  updateTaskInDB: async (task, columnId) => {
    try {
      socket.emit('taskUpdated', task)
    } catch (error: any) {
      console.error('Failed to update task:', error.message)
    }
  },

  deleteTask: (taskId: string, column: string) => {
    try {
      socket.emit('deleteTask', { id: taskId, column })
    } catch (error: any) {
      console.error('Failed to delete task:', error.message)
    }
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: string) => set({ newTaskType: columnId }),

  setBoardState: (board) => set({ board }),

  setSelectedCol: ({ id, status }: SelectedCol) =>
    set({
      selectedCol: {
        id,
        status,
      },
    }),
}))

useBoardStore.getState().setupListeners()

export default useBoardStore

import { create } from 'zustand'
import { getTodosGroupedByColumn } from '../lib/getTodosGroupedByColumn'

interface BoardState {
  board: Board
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void

  newTaskInput: string
  addTask: (todo: string, columnId: TypedColumn) => void
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void
  setNewTaskInput: (input: string) => void
  newTaskType: TypedColumn
  setNewTaskType: (columnId: TypedColumn) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  newTaskInput: '',
  newTaskType: 'todo',

  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumn()
    set({ board })
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    // call to update in database
  },

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    // call to delete in database
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  addTask: async (todo: string, columnId: TypedColumn) => {
    set({ newTaskInput: '' })
    set((state) => {
      const newColumns = new Map(state.board.columns)
      const newTodo: Todo = {
        // Todo: change id to a created task id when made in db
        id: (Math.random() * 10000 + 1).toString(),
        title: todo,
        status: columnId,
      }

      const column = newColumns.get(columnId)

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }

      return { board: { columns: newColumns } }
    })
  },
}))

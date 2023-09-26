import { create } from 'zustand'
import { getTodosGroupedByColumn } from '../lib/getTodosGroupedByColumn'

interface BoardState {
  board: Board
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void

  newTaskInput: string
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void
  setNewTaskInput: (input: string) => void
}

export const useBoardStore = create<BoardState>((set) => ({
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

  newTaskInput: '',

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    // call to delete in database
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
}))

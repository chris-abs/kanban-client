import { create } from 'zustand'
import { getTodosGroupedByColumn } from '../lib/getTodosGroupedByColumn'
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000')

interface BoardState {
  board: Board
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void

  newTodoInput: string
  addTodo: (todo: string, columnId: TypedColumn) => void
  deleteTodo: (todoIndex: number, todoId: Todo, id: TypedColumn) => void
  setNewTodoInput: (input: string) => void
  newTodoType: TypedColumn
  setNewTodoType: (columnId: TypedColumn) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  newTodoInput: '',
  newTodoType: 'todo',

  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    try {
      const board = await getTodosGroupedByColumn(
        'http://localhost:4000/api/v1/todo'
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

  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    try {
      // Call the API endpoint to update the todo
      // Example:
      // await axios.put(`http://localhost:4000/api/v1/todo/${todo.id}`, {
      //   title: todo.title,
      //   status: columnId,
      // });
      // After updating the todo in the API, you can update the local state if needed
      // ...
      socket.emit('todoUpdated', todo)
    } catch (error: any) {
      // Handle the error here (e.g., logging or showing an error message)
      console.error('Failed to update todo:', error.message)
    }
  },

  deleteTodo: async (todoIndex: number, todo: Todo, id: TypedColumn) => {
    try {
      // Call the API endpoint to delete the todo
      // Example:
      // await axios.delete(`http://localhost:4000/api/v1/todo/${todo.id}`);
      // After deleting the todo in the API, you can update the local state if needed
      // ...
      socket.emit('todoDeleted', todo)
    } catch (error: any) {
      // Handle the error here (e.g., logging or showing an error message)
      console.error('Failed to delete todo:', error.message)
    }
  },

  setNewTodoInput: (input: string) => set({ newTodoInput: input }),

  setNewTodoType: (columnId: TypedColumn) => set({ newTodoType: columnId }),

  addTodo: async (todo: string, columnId: TypedColumn) => {
    try {
      // Call the API endpoint to create a new todo
      // Example:
      // const response = await axios.post(`http://localhost:4000/api/v1/todo`, {
      //   title: todo,
      //   status: columnId,
      // });
      // const newTodo = response.data;

      // After creating the new todo in the API, you can update the local state if needed
      // ...
      socket.emit(
        'todoCreated'
        // newTodo
      )
      set({ newTodoInput: '' })
    } catch (error: any) {
      // Handle the error here (e.g., logging or showing an error message)
      console.error('Failed to add todo:', error.message)
    }
  },
}))

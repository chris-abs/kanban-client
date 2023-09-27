'use client'
import { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'

import { useBoardStore } from '../store/BoardStore'
import Column from './Column'

const Board: React.FC = () => {
  const [getBoard, board, setBoardState] = useBoardStore((state) => [
    state.getBoard,
    state.board,
    state.setBoardState,
  ])

  useEffect(() => {
    getBoard()
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    // if a user drags outside of a column
    if (!destination) {
      return
    }

    if (type === 'column') {
      // converting key value pairs to an array
      const entries = Array.from(board.columns.entries())
      // storing todo as 'removed' and removing it from the original locations array
      const [removed] = entries.splice(source.index, 1)
      // pushing the 'removed' todo into its chosen position in the new column
      entries.splice(destination.index, 0, removed)
      // storing entries in a new rearranged column
      const rearrangedColumns = new Map(entries)
      // setting the updating columns' global state
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      })
    }

    // data indexes are being stored as numbers by DnD as opposed to IDs, which is not of the same map format
    // - so we need to convert

    // create a copy of the column
    const columns = Array.from(board.columns)
    // creating variables that translate the source and destination index values into their respective IDs
    // ie, source: 0 -> todo, destination: 3 -> done
    const startColIndex = columns[Number(source.droppableId)]
    const finishColIndex = columns[Number(destination.droppableId)]

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    }

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    }

    // edge case protection - if values aren't returned or
    // if user drops todo back to its exact same position in same column, return
    if (!startCol || !finishCol) return
    if (source.index === destination.index && startCol === finishCol) {
      return
    }

    // copy of todos
    const newTodos = startCol.todos
    // splice the todo that's moving
    const [todoMoved] = newTodos.splice(source.index, 1)

    // we need to manage two cases, if a todo is being repositioned inside the column it came from
    // or if the todo is being moved into a different column
    if (startCol.id === finishCol.id) {
      // ** todo is dragged into a new position in the same column **

      // splice into the new column location
      newTodos.splice(destination.index, 0, todoMoved)
      //create a new column object
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      }
      // creating a new mutable copy of the existing column
      const newColumns = new Map(board.columns)
      // replacing the old column with the new column
      newColumns.set(startCol.id, newCol)
      // setting to global state
      return setBoardState({ ...board, columns: newColumns })
    } else {
      // ** todo is dragged into a new column **

      // copy of finished column
      const finishTodos = Array.from(finishCol.todos)
      // splicing to find the moving todo
      finishTodos.splice(destination.index, 0, todoMoved)
      // creating a new mutable copy of the existing columns
      const newColumns = new Map(board.columns)
      // create a new column object
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      }

      // replace the original source column with the updated source column (- moved todo)
      newColumns.set(startCol.id, newCol)
      // replace the orginal destination column with the updated destination (+ moved todo)
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      })

      // TODO: update in DB

      // update global state
      setBoardState({ ...board, columns: newColumns })
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Board

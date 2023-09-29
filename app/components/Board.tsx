'use client'
import { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'

import useBoardStore from '../store/BoardStore'
import Column from './Column'

const Board: React.FC = () => {
  const [getBoard, board, setBoardState, taskMovedToNewColumn] = useBoardStore(
    (state) => [
      state.getBoard,
      state.board,
      state.setBoardState,
      state.taskMovedToNewColumn,
    ]
  )

  useEffect(() => {
    getBoard()
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type, ...rest } = result

    // if a user drags outside of a column
    if (!destination) {
      return
    }

    if (type === 'column') {
      // converting key value pairs to an array
      const entries = Array.from(board.columns.entries())
      // storing task as 'removed' and removing it from the original locations array
      const [removed] = entries.splice(source.index, 1)
      // pushing the 'removed' task into its chosen position in the new column
      entries.splice(destination.index, 0, removed)
      // storing entries in a new rearranged column
      const rearrangedColumns = new Map(entries)
      // setting the updating columns' global state
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      })
    }

    // create a copy of the column
    const columns = Array.from(board.columns)
    const arr = Array.from(board.columns).map(([name, value]) => ({
      name,
      column: value,
    }))

    const sourceCol = arr.find((a) => a.column.id === source.droppableId)
    const finish = arr.find((a) => a.column.id === destination.droppableId)

    if (!sourceCol && !finish) {
      return
    }
    const startCol: Column = {
      id: sourceCol?.column.id as string,
      name: sourceCol?.name as string,
      tasks: sourceCol?.column.tasks as Task[],
    }

    const finishCol: Column = {
      id: finish?.column.id as string,
      name: finish?.name as string,
      tasks: finish?.column.tasks as Task[],
    }

    // edge case protection - if values aren't returned or
    // if user drops task back to its exact same position in same column, return
    if (!startCol || !finishCol) return
    if (source.index === destination.index && startCol === finishCol) {
      return
    }

    // copy of tasks
    const newTasks = startCol.tasks
    // splice the task that's moving
    const [taskMoved] = newTasks.splice(source.index, 1)

    // we need to manage two cases, if a task is being repositioned inside the column it came from
    // or if the task is being moved into a different column
    if (startCol.id === finishCol.id) {
      // ** task is dragged into a new position in the same column **

      // splice into the new column location
      newTasks.splice(destination.index, 0, taskMoved)
      //create a new column object
      const newCol = {
        id: startCol.id,
        name: startCol.name,
        tasks: newTasks,
      }
      // creating a new mutable copy of the existing column
      const newColumns = new Map(board.columns)
      // replacing the old column with the new column
      newColumns.set(startCol.id, newCol)
      // setting to global state
      return setBoardState({ ...board, columns: newColumns })
    } else {
      // ** task is dragged into a new column **

      // copy of finished column
      const finishTasks = finishCol.tasks
      // splicing to find the moving task
      finishTasks.splice(destination.index, 0, taskMoved)
      // creating a new mutable copy of the existing columns
      const newColumns = new Map(board.columns)
      // create a new column object
      const newCol = {
        id: startCol.id,
        name: finishCol.name,
        // This is the starting column
        source: source.droppableId,
        tasks: newTasks,
      }

      // replace the original source column with the updated source column (- moved task)
      newColumns.set(newCol.name, newCol)
      // replace the orginal destination column with the updated destination (+ moved todo)
      newColumns.set(newCol.name, {
        id: finishCol.id,
        name: 'inprogress',
        tasks: finishTasks,
      })

      setBoardState({ ...board, columns: newColumns })

      const event = {
        taskId: rest.draggableId,
        sourceCol: {
          id: source.droppableId,
          name: startCol.name,
        },
        finishedCol: {
          id: destination.droppableId,
          name: finishCol.name,
        },
      }

      taskMovedToNewColumn(event)
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto p-4'
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {Array.from(board.columns.entries()).map(
              ([status, column], index) => (
                <Column
                  key={column.id}
                  id={column.id}
                  status={status}
                  tasks={column.tasks}
                  index={index}
                />
              )
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Board

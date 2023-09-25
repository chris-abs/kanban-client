'use client'
import { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'

import { useBoardStore } from '../store/BoardStore'
import Column from './Column'

const Board = () => {
  const [getBoard, board, setBoardState] = useBoardStore((state) => [
    state.getBoard,
    state.board,
    state.setBoardState,
  ])
  useEffect(() => {
    getBoard
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result
    console.log('destination', destination)
    console.log('source', source)
    console.log('type', type)

    if (!destination) return

    if (type === 'column') {
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedColumns = new Map(entries)
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      })
    }

    // data indexes are being stored as numbers by DnD as opposed to IDs
    const columns = Array.from(board.columns)

    if (
      // column start id === column finish id
      // we know the todo is being repositioned inside of the same column
    ) {
      // ** todo is dragged into a new position in the same column **
      // splice todos by destination index and todoMoved 
      // create newColumn with the new data
      // create new map using the new column
      // set board state

    } else {
      // ** todo is dragged into a new column **
      // create new array
      // splice array using the destination index and todoMoved
      // create a newColumns using a new map and the old board.columns
      // create a new column with the same structure as the old colum
      // and set the new data ontop of the old data
    }

    // update database
    // setBoardState((...board, columns: newColumns))
  }

  console.log(board)
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

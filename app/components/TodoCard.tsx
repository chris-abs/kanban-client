'use client'

import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from '@hello-pangea/dnd'

import Delete from '../icons/Delete'
import useBoardStore from '../store/BoardStore'

type TaskCardProps = {
  task: Task
  index: number
  id: string
  innerRef: (element: HTMLElement | null) => void
  draggableProps: DraggableProvidedDraggableProps
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}

const TodoCard: React.FC<TaskCardProps> = ({
  task,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const { deleteTask } = useBoardStore()

  const handleDeleteClick = () => {
    deleteTask(task.id, task.status)
  }

  return (
    <div
      className='bg-white rounded-md space-y-2 drop-shadow-md'
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}>
      <div className='flex justify-between items-center p-5'>
        <p>{task.title}</p>
        <button
          onClick={handleDeleteClick}
          className='text-red-500 hover:text-red-600'>
          <Delete className='ml-5 h-8 w-8' />
        </button>
      </div>
    </div>
  )
}

export default TodoCard

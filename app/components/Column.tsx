import { Draggable, Droppable } from '@hello-pangea/dnd'
import TodoCard from './TodoCard'
import Add from '../icons/Add'
import { useModalStore } from '../store/ModalStore'
import useBoardStore from '../store/BoardStore'

type ColumnProps = {
  id: string
  tasks: Task[]
  index: number
  status: string
}

const idToColumnTitle: {
  [key in string]: string
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
}

const Column: React.FC<ColumnProps> = ({ id, status, tasks, index }) => {
  const { setSelectedCol } = useBoardStore()
  const openModal = useModalStore((state) => state.openModal)

  const handleAddTodo = () => {
    setSelectedCol({
      id: id,
      status: status,
    })
    openModal()
  }

  return (
    // Rendering draggable columns for the task statuses
    <Draggable draggableId={id} index={index} key={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}>
          <Droppable droppableId={id} type='card'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
                }`}>
                <h2 className='flex justify-between font-bold text-xl pb-2'>
                  {idToColumnTitle[status]}
                  <span className='text-gray-500 rounded-full px-2 py-1 text-sm font-normal'>
                    {tasks.length}
                  </span>
                </h2>
                <div className='space-y-2'>
                  {tasks.map((task: any, i) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={Number(i)}>
                      {(provided) => (
                        <TodoCard
                          task={task}
                          index={i}
                          id={task._id}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className='flex items-end justify-end p-2'>
                    <button
                      onClick={handleAddTodo}
                      className='text-green-500 hover:text-green-600'>
                      <Add className='h-10 w-10' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default Column

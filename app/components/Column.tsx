import { Draggable, Droppable } from 'react-beautiful-dnd'
import TodoCard from './TodoCard'
import Add from '../icons/Add'
import { useModalStore } from '../store/ModalStore'
import { useBoardStore } from '../store/BoardStore'

type ColumnProps = {
  id: TypedColumn
  todos: Todo[]
  index: number
}

const idToColumnTitle: {
  [key in TypedColumn]: string
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
}

const Column: React.FC<ColumnProps> = ({ id, todos, index }) => {
  const [setNewTaskType] = useBoardStore((state) => [state.setNewTaskType])
  const openModal = useModalStore((state) => state.openModal)

  const handleAddTodo = () => {
    setNewTaskType(id)
    openModal()
  }

  return (
    // Rendering draggable columns for the todo statuses
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}>
          {/* Rendering droppable todos inside of the columns */}
          <Droppable droppableId={index.toString()} type='card'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
                }`}>
                <h2 className='flex justify-between font-bold text-xl'>
                  {idToColumnTitle[id]}
                  <span className='text-gray-500 bg-200 rounded-full px-2 py-1 text-sm font-normal'>
                    {todos.length}
                  </span>
                </h2>
                <div className='space-y-2'>
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}>
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
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

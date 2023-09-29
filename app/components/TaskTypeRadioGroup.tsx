'use client'

import { RadioGroup } from '@headlessui/react'
import useBoardStore from '../store/BoardStore'
import Check from '../icons/Check'

const groupTypes = [
  {
    id: 'todo',
    name: 'Todo',
    description: 'A task not started',
    colour: 'bg-red-500',
  },
  {
    id: 'inprogress',
    name: 'In Progress',
    description: 'A task currently in progress',
    colour: 'bg-amber_300',
  },
  {
    id: 'done',
    name: 'Done',
    description: 'A completed task',
    colour: 'bg-green-500',
  },
]

const TaskTypeRadioGroup = () => {
  const [setNewTaskType, newTaskType] = useBoardStore((state) => [
    state.setNewTaskType,
    state.newTaskType,
  ])
  return (
    <div className='w-full py-5'>
      <div className='mx-auto w-full max-w-md'>
        <RadioGroup
          value={newTaskType}
          onChange={(e) => {
            setNewTaskType(e)
          }}>
          <div className='space-y-2'>
            {groupTypes.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                      : ''
                  } ${
                    checked
                      ? `${type.colour} bg-opacity-75 text-white`
                      : 'bg-white'
                  } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }>
                {({ active, checked }) => (
                  <>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='text-sm'>
                          <RadioGroup.Label
                            as='p'
                            className={`font-medium ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}>
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as='span'
                            className={`inline ${
                              checked ? 'text-white' : 'text-gray-500'
                            }`}>
                            <span>{type.description}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className='shrink-0 text-white'>
                          <Check className='shrink-0 text-white' />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default TaskTypeRadioGroup

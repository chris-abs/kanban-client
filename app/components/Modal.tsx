'use client'

import { FormEvent, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { useModalStore } from '../store/ModalStore'
import useBoardStore from '../store/BoardStore'
import TaskTypeRadioGroup from './TaskTypeRadioGroup'

const Modal = () => {
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ])

  const [newTaskInput, setNewTaskInput, newTaskType, addTask, selectedCol] =
    useBoardStore((state) => [
      state.newTaskInput,
      state.setNewTaskInput,
      state.newTaskType,
      state.addTask,
      state.selectedCol,
    ])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newTaskInput) return

    console.log('submitted')
    addTask({
      title: newTaskInput,
      columnId: selectedCol.id,
      status: selectedCol.status,
    })

    closeModal()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='form'
        className='relative z-10'
        onClose={closeModal}
        onSubmit={handleSubmit}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900 pb-2'>
                  Add a task
                </Dialog.Title>
                <div className='mt-2'>
                  <input
                    type='text'
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder='Enter a new task here...'
                    className='w-full border border-gray-300 rounded-md outline-none p-5'
                  />
                </div>

                <TaskTypeRadioGroup />

                <div className='mt-4'>
                  <button
                    type='submit'
                    disabled={!newTaskInput}
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 foxus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed'>
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal

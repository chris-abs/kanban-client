'use client'

import Image from 'next/image'
import Avatar from './Avatar'

const Header = () => {
  return (
    <header>
      <div className='flex md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
        {/* Bluur effect?
        <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#eca988] to-[#d88459] filter blur-3xl opacity-50 -z-50' /> */}
        {/* Logo */}
        <Image
          priority
          src='/images/logo.png'
          alt='abbottban logo'
          width={200}
          height={80}
          className='w-36 md:w-44 pb-10 ms:pb-0 object-contain'
        />
        {/* Avatar */}
        <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
          <Avatar src='' />
        </div>
      </div>
    </header>
  )
}

export default Header

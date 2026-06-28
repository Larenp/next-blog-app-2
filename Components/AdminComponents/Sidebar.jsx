'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='flex flex-col bg-slate-50 w-28 sm:w-80 h-screen border-r border-black'>
      <div className='px-2 sm:pl-14 py-3 border-b border-black'>
        <Link href='/'>
          <Image src={assets.logo} width={120} alt='Blogger' className='w-[80px] sm:w-auto' />
        </Link>
      </div>
      <div className='w-28 sm:w-80 h-[100vh] relative py-12 flex flex-col gap-6 sm:pl-14'>
        <Link href='/admin/addBlog' className='flex items-center gap-3 font-medium px-3 py-2 bg-white border border-black shadow-[-5px_5px_0px_#000000] cursor-pointer w-[80%] hover:bg-gray-100 transition-all duration-200'>
            <Image src={assets.add_icon} alt='Add' width={28} />
            <p className='hidden sm:inline-block'>Add blog</p>
        </Link>
        <Link href='/admin/blogList' className='flex items-center gap-3 font-medium px-3 py-2 bg-white border border-black shadow-[-5px_5px_0px_#000000] cursor-pointer w-[80%] hover:bg-gray-100 transition-all duration-200'>
            <Image src={assets.blog_icon} alt='List' width={28} />
            <p className='hidden sm:inline-block'>Blog list</p>
        </Link>
        <Link href='/admin/subscriptions' className='flex items-center gap-3 font-medium px-3 py-2 bg-white border border-black shadow-[-5px_5px_0px_#000000] cursor-pointer w-[80%] hover:bg-gray-100 transition-all duration-200'>
            <Image src={assets.email_icon} alt='Subs' width={28} />
            <p className='hidden sm:inline-block'>Subscriptions</p>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar

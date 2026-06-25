'use client'
import { assets, blog_data } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import React, { use } from 'react'

const page = ({ params }) => {
  const { id } = use(params);
  const data = blog_data.find((item) => String(item.id) === String(id));

  if (!data) return (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-lg font-medium text-gray-500'>Blog post not found.</p>
    </div>
  );

  return (<>
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
      <div className='flex justify-between items-center'>
        <Link href='/'>
          <Image src={assets.logo} width={180} alt='Blogger logo' style={{ height: 'auto' }} className='w-[130px] sm:w-auto' />
        </Link>
        <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
          Get started <Image src={assets.arrow} alt='Arrow' />
        </button>
      </div>
      <div className='text-center my-24'>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
        <Image className='mx-auto mt-6 border border-white rounded-full' src={data.author_img} width={60} height={60} alt={data.author} />
        <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
      </div>
    </div>
    <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
      <Image className='border-4 border-white w-full h-auto' src={data.image} width={800} height={480} alt={data.title} />
      <div className='blog-content' dangerouslySetInnerHTML={{__html: data.description}}>
      </div>
      <div className='my-24'>
        <p className='text-black font font-semibold my-4'>Share this article on social media</p>
        <div className='flex'>
          <Image src={assets.facebook_icon} width={50} alt='Facebook' />
          <Image src={assets.twitter_icon} width={50} alt='Twitter' />
          <Image src={assets.googleplus_icon} width={50} alt='Google Plus' />
        </div>
      </div>
    </div>
    <Footer />
  </>
  )
}

export default page

import React from 'react'
import Image from 'next/image'
import { assets } from '@/Assets/assets'

const BlogTableItem = ({ authorImg, author, title, date, deleteBlog, mongoId }) => {
  const blogDate = new Date(date);
  return (
    <tr className="bg-white border-b border-gray-400 text-left">
      <th scope="row" className="items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        <Image src={authorImg ? authorImg : assets.profile_icon} width={40} height={40} className='rounded-full' alt='' />
        <p>{author ? author : "No Author"}</p>
      </th>
      <td className="px-6 py-4">
        {title ? title : "Untitled Blog"}
      </td>
      <td className="px-6 py-4">
        {blogDate.toDateString()}
      </td>
      <td onClick={() => deleteBlog(mongoId)} className="px-6 py-4 cursor-pointer text-red-500 hover:text-red-700 font-bold">
        x
      </td>
    </tr>
  )
}

export default BlogTableItem

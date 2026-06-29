import React from 'react'
import Image from 'next/image'
import { assets } from '@/Assets/assets'

const BlogTableItem = ({ authorImg, author, title, date, deleteBlog, mongoId }) => {
  const blogDate = new Date(date);
  return (
    <tr className="border-b border-[#1A1A1A]/10 hover:bg-[#EBE5DE]/20 transition-colors duration-300">
      <th scope="row" className="items-center gap-3 hidden sm:flex px-6 py-5 font-normal">
        <div className="relative w-8 h-8 overflow-hidden shrink-0 bg-[#EBE5DE]">
          <Image
            src={authorImg ? authorImg : assets.profile_icon}
            width={32}
            height={32}
            className="object-cover"
            alt={author || 'Author'}
          />
        </div>
        <p className="font-body text-xs text-[#6C6863] uppercase tracking-[0.1em]">
          {author ? author : "No Author"}
        </p>
      </th>
      <td className="px-6 py-5 font-heading text-[#1A1A1A] text-sm leading-snug">
        {title ? title : "Untitled Blog"}
      </td>
      <td className="px-6 py-5 font-body text-[10px] text-[#6C6863] uppercase tracking-[0.1em] whitespace-nowrap">
        {blogDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td
        onClick={() => deleteBlog(mongoId)}
        className="px-6 py-5 cursor-pointer font-body text-[10px] uppercase tracking-[0.15em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
      >
        Remove
      </td>
    </tr>
  )
}

export default BlogTableItem


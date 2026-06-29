'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog');
    setBlogs(response.data.blogs);
  }

  const deleteBlog = async (mongoId) => {
    const response = await axios.delete('/api/blog', { params: { id: mongoId } })
    toast.success(response.data.msg);
    fetchBlogs();
  }

  useEffect(() => {
    const loadBlogs = async () => {
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs);
    }

    loadBlogs()
  }, [])

  return (
    <div className="flex-1 px-8 md:px-12 pt-10 pb-16">

      {/* Page heading */}
      <div className="flex items-center gap-4 mb-2">
        <span className="block h-px w-6 bg-[#D4AF37]" aria-hidden="true" />
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">Content</p>
      </div>
      <h1 className="font-heading text-[#1A1A1A] text-3xl md:text-4xl tracking-tight mb-10">
        All Articles
      </h1>

      {/* Table */}
      <div className="border border-[#1A1A1A]/10 overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#1A1A1A]/10 bg-[#EBE5DE]/30">
              <th scope="col" className="hidden sm:table-cell px-6 py-4 text-left font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863]">
                Author
              </th>
              <th scope="col" className="px-6 py-4 text-left font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863]">
                Blog Title
              </th>
              <th scope="col" className="px-6 py-4 text-left font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863]">
                Date
              </th>
              <th scope="col" className="px-6 py-4 text-left font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item, index) => (
              <BlogTableItem
                key={index}
                mongoId={item._id}
                title={item.title}
                author={item.author}
                authorImg={item.authorImg}
                date={item.date}
                deleteBlog={deleteBlog}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Page


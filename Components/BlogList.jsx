'use client'
import React, { useEffect, useState } from 'react'
import BlogItem from './BlogItem'
import axios from 'axios';

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs);
    }

    fetchBlogs();
  }, [])

  const categories = ["All", "Technology", "Startup", "Lifestyle"];

  return (
    <section className="bg-[#F9F8F6] px-8 md:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">

      {/* Section overline */}
      <div className="flex items-center gap-4 mb-10">
        <span className="block h-px w-8 bg-[#D4AF37]" aria-hidden="true" />
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
          The Journal
        </p>
      </div>

      {/* Section heading */}
      <h2 className="font-heading text-[#1A1A1A] text-4xl md:text-5xl leading-tight tracking-tight mb-12">
        Latest{' '}
        <em className="italic" style={{ color: '#D4AF37' }}>Stories</em>
      </h2>

      {/* Category filter tabs */}
      <div className="flex items-center gap-0 mb-14 border-b border-[#1A1A1A]/15">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setMenu(cat)}
            id={`filter-${cat.toLowerCase()}`}
            className={`relative font-body text-xs uppercase tracking-[0.2em] px-6 py-4 transition-colors duration-300 ${menu === cat ? 'text-[#1A1A1A]' : 'text-[#6C6863] hover:text-[#1A1A1A]'}`}
          >
            {cat}
            {/* Active gold underline */}
            <span
              className={`absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37] transition-opacity duration-300 ${menu === cat ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {/* Blog grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {blogs
          .filter((item) => menu === "All" ? true : item.category === menu)
          .map((item, index) => (
            <BlogItem
              key={index}
              id={item._id || item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
              date={item.date}
            />
          ))}
      </div>
    </section>
  )
}

export default BlogList


import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({ title, description, category, image, id, date }) => {
  const blogDate = date ? new Date(date) : null;

  return (
    <article className="group flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-700">

      {/* Image container */}
      <Link href={`/blogs/${id}`} className="relative block overflow-hidden aspect-[4/5] shrink-0 bg-[#EBE5DE]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover grayscale hover:grayscale-0 group-hover:scale-105"
          style={{ transition: 'filter 1500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Inner border overlay */}
        <span className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" aria-hidden="true" />
      </Link>

      {/* Card body */}
      <div className="border-t border-[#1A1A1A] pt-5 pb-6 flex flex-col flex-1 bg-[#F9F8F6]">

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-body text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            {category}
          </span>
          {blogDate && (
            <>
              <span className="block h-px w-4 bg-[#1A1A1A]/20" aria-hidden="true" />
              <span className="font-body text-[10px] text-[#6C6863]">
                {blogDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-[#1A1A1A] text-xl leading-snug tracking-tight mb-3 flex-1">
          {title}
        </h3>

        {/* Excerpt */}
        <p
          className="font-body text-sm text-[#6C6863] leading-relaxed mb-5 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description?.slice(0, 110) }}
        />

        {/* Read more link */}
        <Link
          href={`/blogs/${id}`}
          className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] group/link hover:text-[#D4AF37] transition-colors duration-500"
        >
          Read Article
          <span
            className="block h-px w-5 bg-current transition-all duration-500 group-hover/link:w-8"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}

export default BlogItem


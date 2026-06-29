'use client'
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, use } from 'react'

const page = ({ params }) => {
  const { id } = use(params);
  const [data, setData] = useState(null);

  const fetchBlogData = async () => {
    const response = await axios.get('/api/blog', { params: { id } })
    setData(response.data);
  }

  useEffect(() => {
    fetchBlogData();
  }, [])

  if (!data) return null;

  const blogDate = data.date ? new Date(data.date) : null;

  return (
    <>
      {/* Dark editorial header */}
      <div className="bg-[#1A1A1A] relative overflow-hidden">
        <div className="noise-overlay opacity-[0.015]" aria-hidden="true" />

        {/* Nav */}
        <div className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 border-b border-[#F9F8F6]/10">
          <Link href="/" className="font-heading text-[#F9F8F6] text-xl tracking-tight">
            The Editorial
          </Link>
          <Link
            href="/"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-[#EBE5DE]/60 hover:text-[#D4AF37] transition-colors duration-500"
          >
            ← Back to Journal
          </Link>
        </div>

        {/* Hero text */}
        <div className="relative z-10 px-8 md:px-16 pt-16 pb-24 md:pt-20 md:pb-32 max-w-[1600px] mx-auto">
          {/* Overline */}
          <div className="flex items-center gap-4 mb-8">
            <span className="block h-px w-8 bg-[#D4AF37]" aria-hidden="true" />
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
              {data.category}
              {blogDate && (
                <> &nbsp;/&nbsp; {blogDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</>
              )}
            </p>
          </div>

          {/* Title */}
          <h1 className="font-heading text-[#F9F8F6] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight max-w-4xl mb-10">
            {data.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-4">
            {data.authorImg && (
              <div className="relative w-10 h-10 overflow-hidden shrink-0 bg-[#EBE5DE]">
                <Image
                  src={data.authorImg}
                  alt={data.author}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-body text-[#F9F8F6] text-sm">{data.author}</p>
              {blogDate && (
                <p className="font-body text-[10px] text-[#6C6863] uppercase tracking-[0.15em]">
                  {blogDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="bg-[#F9F8F6] px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="relative -mt-12 md:-mt-16 mb-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 90vw"
            />
            <span className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="bg-[#F9F8F6] px-8 md:px-16 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="max-w-[720px]">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          {/* Divider */}
          <div className="h-px w-full bg-[#1A1A1A]/10 my-12" aria-hidden="true" />

          {/* Share row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
              Share this article
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}` },
                { label: 'Twitter', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}` },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[10px] uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default page


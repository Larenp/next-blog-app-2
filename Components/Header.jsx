'use client'
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Header = () => {
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    const response = await axios.post('/api/email', formData);
    if (response.data.success) {
      toast.success(response.data.msg);
      setEmail("");
    } else {
      toast.error("Error");
    }
  }

  return (
    <header className="relative bg-[#F9F8F6] overflow-hidden">

      {/* Paper grain noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Vertical editorial gridlines */}
      <div className="gridline hidden lg:block" style={{ left: '8%' }} aria-hidden="true" />
      <div className="gridline hidden lg:block" style={{ left: '33.33%' }} aria-hidden="true" />
      <div className="gridline hidden lg:block" style={{ left: '66.66%' }} aria-hidden="true" />
      <div className="gridline hidden lg:block" style={{ right: '8%' }} aria-hidden="true" />

      {/* Top navigation bar */}
      <div className="relative z-20 flex items-center px-8 md:px-16 py-5 border-b border-[#1A1A1A]/10">
        <a href="/" className="font-heading text-[#1A1A1A] text-xl tracking-tight font-normal select-none">
          The Editorial
        </a>
      </div>

      {/* Hero section */}
      <div className="relative z-20 px-8 md:px-16 pt-16 pb-20 md:pt-20 md:pb-28 max-w-[1600px] mx-auto">

        {/* Overline label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="block h-px w-8 md:w-12 bg-[#D4AF37]" aria-hidden="true" />
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
            Editorial / Est. 2025
          </p>
        </div>

        {/* Main headline */}
        <h1 className="font-heading text-[#1A1A1A] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.93] tracking-tight max-w-4xl mb-7">
          Stories That{' '}
          <em className="not-italic italic" style={{ color: '#D4AF37' }}>Define</em>
          <br />
          the Moment
        </h1>

        {/* Subtext */}
        <p className="font-body text-[#6C6863] text-sm md:text-base leading-relaxed max-w-md mb-10">
          A curated journal of ideas at the intersection of technology, culture, and the art of living deliberately.
        </p>

        {/* Subscription form */}
        <div className="max-w-md">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-[#6C6863] mb-5">
            Subscribe to the Journal
          </p>
          <form onSubmit={onSubmitHandler} className="flex items-end gap-4">
            <div className="flex-1 relative">
              <input
                type="email"
                id="header-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full h-12 bg-transparent border-0 border-b border-[#1A1A1A] pb-2 pt-1 text-sm text-[#1A1A1A] font-body placeholder:font-heading placeholder:italic placeholder:text-[#6C6863] outline-none focus:border-[#D4AF37] transition-colors duration-300"
                style={{ borderRadius: 0 }}
              />
            </div>
            <button
              type="submit"
              id="subscribe-btn"
              className="relative inline-flex items-center justify-center overflow-hidden h-12 px-8 shrink-0 group shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
              style={{ backgroundColor: '#1A1A1A', borderRadius: 0 }}
            >
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0"
                style={{
                  backgroundColor: '#D4AF37',
                  transition: 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
                aria-hidden="true"
              />
              <span className="relative z-10 text-white text-[10px] uppercase tracking-[0.2em] font-medium font-body">
                Subscribe
              </span>
            </button>
          </form>
        </div>

        {/* Vertical decorative label — desktop only */}
        <div
          className="writing-vertical hidden xl:block absolute right-16 bottom-20 text-[#1A1A1A]/20 text-[10px] uppercase tracking-[0.3em] font-body select-none"
          aria-hidden="true"
        >
          Editorial Vol. 01 — 2025
        </div>
      </div>

      {/* Bottom border */}
      <div className="border-b border-[#1A1A1A]/15" aria-hidden="true" />
    </header>
  )
}

export default Header




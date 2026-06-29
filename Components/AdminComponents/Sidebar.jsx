'use client'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/admin/addBlog', label: 'Add Blog', icon: '+' },
  { href: '/admin/blogList', label: 'Blog List', icon: '≡' },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: '✉' },
]

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col bg-[#F9F8F6] w-16 sm:w-64 h-screen border-r border-[#1A1A1A]/15 shrink-0">

      {/* Logo */}
      <div className="px-4 sm:px-8 py-6 border-b border-[#1A1A1A]/15">
        <Link href="/" className="font-heading text-[#1A1A1A] text-base sm:text-lg tracking-tight whitespace-nowrap overflow-hidden">
          <span className="hidden sm:inline">The Editorial</span>
          <span className="sm:hidden text-lg">TE</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col py-8 gap-1 px-3 sm:px-5">
        <p className="hidden sm:block font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863] mb-3 px-3">
          Navigation
        </p>
        {navLinks.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-3 transition-all duration-300 border-l-2
                ${isActive
                  ? 'border-[#D4AF37] bg-[#EBE5DE]/50 text-[#1A1A1A]'
                  : 'border-transparent text-[#6C6863] hover:border-[#D4AF37]/50 hover:text-[#1A1A1A] hover:bg-[#EBE5DE]/30'
                }`}
            >
              <span className="font-body text-base w-5 text-center shrink-0" aria-hidden="true">
                {icon}
              </span>
              <span className="hidden sm:inline font-body text-xs uppercase tracking-[0.15em]">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  )
}

export default Sidebar


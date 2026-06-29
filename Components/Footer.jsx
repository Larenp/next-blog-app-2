import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#F9F8F6]/10">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-14 md:py-16">

        {/* Top row: logo + social */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mb-10 pb-10 border-b border-[#F9F8F6]/10">

          {/* Brand */}
          <div>
            <p className="font-heading text-[#F9F8F6] text-2xl tracking-tight mb-2">The Editorial</p>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
              A curated journal / Since 2025
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="font-body text-[10px] uppercase tracking-[0.2em] text-[#EBE5DE]/60 hover:text-[#D4AF37] transition-colors duration-500"
            >
              Facebook
            </a>
            <span className="block w-px h-3 bg-[#F9F8F6]/15" aria-hidden="true" />
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="font-body text-[10px] uppercase tracking-[0.2em] text-[#EBE5DE]/60 hover:text-[#D4AF37] transition-colors duration-500"
            >
              Twitter
            </a>
            <span className="block w-px h-3 bg-[#F9F8F6]/15" aria-hidden="true" />
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="font-body text-[10px] uppercase tracking-[0.2em] text-[#EBE5DE]/60 hover:text-[#D4AF37] transition-colors duration-500"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom row: copyright */}
        <p className="font-body text-[10px] text-[#6C6863] tracking-[0.15em] uppercase">
          © {year} The Editorial. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer


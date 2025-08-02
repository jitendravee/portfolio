'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
]

const Navbar = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        fixed z-50 
        left-1/2 -translate-x-1/2 
        bottom-4 md:top-4 md:bottom-auto
        transition-all duration-300
        rounded-t-[12px] md:rounded-[12px]
        px-4 sm:px-6
        ${scrolled ? 'bg-[var(--elevation-five)] shadow-md' : ''}
      `}
    >
      <div className='flex justify-center gap-2 sm:gap-4'>
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href
          return (
            <Link key={idx} href={item.href}>
              <button
                className={`group bg-transparent hover:bg-transparent border-none text-[var(--text-secondary)] text-[1.1rem] select-none flex flex-col items-center gap-[.5rem] py-[10px] px-[16px] sm:px-[20px] rounded-[100px] cursor-pointer md:hover:bg-[var(--elevation-four)] transition-colors duration-200`}
              >
                {item.label}
              </button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Navbar

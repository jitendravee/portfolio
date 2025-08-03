"use client"
import React from 'react'
import { socialLinks } from './HeroSection'
import TextBuilder from '@/reusable/TextBuilder'

const Footer = () => {
  return (
<div className="flex flex-col md:flex-row justify-between gap-4 items-center border-t border-t-[var(--accent-opacity)] py-4">
          <div className="flex gap-4">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                title={item.title}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all flex justify-center items-center w-[60px] h-[60px] bg-transparent border-none rounded-[10px] cursor-pointer hover:bg-[var(--elevation-one)] active:scale-[95%] offset_ring"
              >
                {item.icon}
              </a>
            ))}
          </div>
          <TextBuilder text='Made with love! ❤️' className='text-[16px]'/>
    </div>
  )
}

export default Footer
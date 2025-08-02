import React from 'react'
import TextBuilder from '@/reusable/TextBuilder'
import { DiscordIcon, GithubIcon, GmailIcon, XIcon } from '@/utility/SvgUtility'
import Image from 'next/image'

const socialLinks = [
  {
    icon: <GithubIcon />,
    href: 'https://github.com/yourusername',
    title: 'GitHub',
  },
  {
    icon: <DiscordIcon />,
    href: 'https://discord.com/users/yourid',
    title: 'Discord',
  },
  {
    icon: <XIcon />,
    href: 'https://x.com/yourhandle',
    title: 'X (Twitter)',
  },
  {
    icon: <GmailIcon />,
    href: 'mailto:your.email@gmail.com',
    title: 'Email',
  },
]

const HeroSection = () => {
  return (
    <div className='flex justify-between items-center'>
    <div className='flex flex-col gap-4 md:w-[40%] '>

      <TextBuilder isMain={true} text='Jitendra' className='text-[55px] md:text-[96px] leading-none' />
      <TextBuilder
        text='Innovative Frontend Wizard. Transforming Designs into Reality'
        className='text-[22px] md:[26px]'
      />
      <div className='flex gap-4'>
        {socialLinks.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            title={item.title}
            target='_blank'
            rel='noopener noreferrer'
            className='transition-all flex justify-center items-center w-[50px] h-[50px] bg-transparent border-none rounded-[10px] cursor-pointer hover:bg-[var(--elevation-one)] active:scale-[95%] offset_ring'
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
      <div className='img rounded-[48px] w-[400px] h-[370px] aspect-square z-10 md:block self-start bg-[var(--elevation-one)] bg-cover bg-center bg-no-repeat bg-[url("https://imgs.search.brave.com/iky9_GfnXCjBDrS9JAZPqBbuSUoQ6O3zz3HXwignm4w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzcwLzAyLzA4/LzM2MF9GXzk3MDAy/MDg2Ml9xQjJ6NjZ6/WXgxRjRBTGF0T21w/cFlqclF2dnRIRjg4/UC5qcGc")] hidden md:block' />
    </div>
  )
}

export default HeroSection

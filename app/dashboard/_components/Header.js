"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';

const Header = () => {
    let path = usePathname()
    const router = useRouter()
    useEffect(()=>{
        console.log("Path: ",path)
    },[path])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={"/logo.svg"} width={160} height={100} alt='Logo' />
      <ul className='hidden md:flex gap-6'>
            <li onClick={()=>{
              router.push('/dashboard')
            }}
             className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==='/dashboard' && 'text-primary font-bold'}`}>Dashboard</li>
            
            <li onClick={()=>{
              router.push('/dashboard/questions')
            }}
             className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==='/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
            
            <li onClick={()=>{
              router.push('/dashboard/upgrade')
            }}
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==='/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
            
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==='/dashboard/how' && 'text-primary font-bold'}`}>How its works?</li>
      </ul>
        <UserButton/>
    </div>
  )
}

export default Header

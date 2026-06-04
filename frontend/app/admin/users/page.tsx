'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'




export default function Users() {
    const options = ['Last 7 Days', 'Last 20 Days', 'Last 30 Days', 'Last 90 Days'];
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('Last 20 Days');

    return (
        <div className='p-[36px]'>
            {/* Top line */}
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-3'>
                    <Link href={''}>
                        <Image src={'/images/icons/searchIcon.png'} alt={''} width={28} height={28} />
                    </Link>
                    <Link href={''}>
                        <Image src={'/images/icons/updateIcon.png'} alt={''} width={32} height={32} />
                    </Link>
                </div>
            </div>

            <Link href={'/admin/main'}>
                <Image src={'/images/icons/viewAllBtn.png'} alt={''} className='scale-x-[-1] pt-[36px]' width={47} height={34} />
            </Link>
            {/* Тимчасова якщо не буде справжніх даних */}
            <Image src={'/images/admin/userStatistic.png'} alt={''} className='py-[16px] px-[8px]' width={1243} height={200} />

            {/* User managment */}
            <div className='bg-[##FFFFFF] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] rounded-tl-[5px] rounded-tr-[5px]'>
                <div className='py-[16px] px-[8px]'>
                    <div className='flex items-center'>
                        <h1 className='text-[25px] pr-[16px]'>User Managment</h1>
                        <div className='w-[114px] h-[28px] bg-[#1A1D23] rounded-[5px] text-[#FFFFFF]'>
                            <p className='px-[16px]'>К-ть users</p>
                        </div>
                    </div>
                    <div className='flex h-[50px]'>
                        <input className='w-[816px] bg-[#F6F6F6]  pr-[8px]'></input>
                        <button className='bg-[#F6F6F6] w-[123px] flex items-center mx-4 flex px-2'>
                            <Image src={'/images/icons/filtersIcon.png'} alt={''} width={20} height={20} />
                            <p className='px-3'>Filters</p>
                        </button>
                        <div className="relative bg-[#F6F6F6] w-[123px] flex items-center mx-4 flex px-2 '">
                            <button onClick={() => setOpen(!open)}>
                                {selected} &#x2304;
                            </button>
                            {open && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-white z-10">
                                    {options.map(option => (
                                        <div
                                            key={option}
                                            onClick={() => { setSelected(option); setOpen(false); }}
                                            className="cursor-pointer"
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Users list */}
                <div className='px-4 py-2 m-3'>
                    <hr />
                </div>
            </div>

        </div >
    )
}
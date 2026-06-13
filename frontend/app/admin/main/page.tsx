'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminHeaderStore } from '@/app/store/adminHeader';
import { useEffect } from 'react';

export default function MainPage() {

    const setRightContent = useAdminHeaderStore(s => s.setRightContent)
    
        useEffect(() => {
            setRightContent(
                <>
                </>
            )
        }, [])
        
    return (
        <div className='pt-[80px]'>
            <div className='p-6'>
                <h1 className='text-3xl pb-12'>Your stats</h1>
                <img src={'/images/admin/MounthStats.png'} alt='stats' width={916} height={206}/>
            </div>
        </div>
    );
}
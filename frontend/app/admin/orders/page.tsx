'use client';
import { useAdminHeaderStore } from '@/app/store/adminHeader';
import { useEffect } from 'react';

export default function MainPage() {

    const setRightContent = useAdminHeaderStore(s => s.setRightContent)
    
        useEffect(() => {
            setRightContent(
                <>
                    <img src={"/images/admin/icons/searchIcon.png"}/>
                </>
            )
        }, [])
        
    return (
        <div className='pt-[80px]'>
        </div>
    );
}
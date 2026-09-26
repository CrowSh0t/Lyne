import { useAdminHeaderStore } from "@/src/app/store/adminHeader";
import Image from "next/image"
import { useEffect, useState } from "react";

interface AdminHeaderProps {
    rightContent?: React.ReactNode
}

export default function AdminHeader() {
    const [email, setEmail] = useState('');
    const rightContent = useAdminHeaderStore(s => s.rightContent)

    useEffect(() => {
        setEmail(localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail') || '');
    }, [])
    return (
        <div className="h-[68px] flex items-center justify-between px-6 py-3">
            {/* Ліва частина екрану */}
            <div className='flex items-center grab-3'>
                <div className="w-[59px] h-[59px] rounded-full bg-black flex items-center justify-center">
                    <img src={"/images/admin/AdminIcon.png"} alt='' width={39} height={39} />
                </div>
                <div className='p-[5px]'>
                    <h3 className='text-[18px]'>{email}</h3>
                    <h6 className='text-[16px]'>admin</h6>
                </div>
            </div>
            {/* Права чатсина */}
            <div className="flex items-center gap-4">
                {rightContent}
                <img src={"/images/admin/icons/notificationIcon.png"}/>
            </div>
        </div>
    )
}
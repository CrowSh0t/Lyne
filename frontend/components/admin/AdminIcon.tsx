import Image from "next/image"
import { useEffect, useState } from "react";

export default function AdminIcon() {
    const [email, setEmail] = useState('');

    useEffect(() => {
        setEmail(localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail') || '');
    }, [])
    return (
        <div className="h-[68px]">
            <div className='flex items-center '>
                <div className="w-[59px] h-[59px] rounded-full bg-black flex items-center justify-center">
                    <Image src={"/images/admin/adminIcon.png"} alt='' width={39} height={39} />
                </div>
                <div className='p-[5px]'>
                    <h3 className='text-[18px]'>{email}</h3>
                    <h6 className='text-[16px]'>admin</h6>
                </div>
            </div>
        </div>
    )
}
'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


export default function Menu(){
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear()
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        router.push('/admin/login')
    }
    
    return(
        <div>
            <div className="bg-[url('/images/admin/mainMenuBackground.png')] flex flex-col items-center justify-center w-[402px] min-h-screen py-5 border border-[#b0a0d0]">
                <h1 className="text-[64px]">LYNE</h1>
                <h3>Concept store</h3>

                <div className="flex flex-col flex-1 w-full pl-5">
                    <Link href="/admin/main" className="flex items-center gap-4 px-6 py-4 cursor-pointer text-base text-[#1a1a1a] no-underline w-full last:border-b-0 hover:scale-[0.85] transition-transform duration-500 ease-in-out">
                        <Image src="/images/icons/mainIcon.png" alt="icon" width={33} height={33} />
                        <span>Main</span>
                    </Link>
                    <Link href="/admin/selling" className="flex items-center gap-4 px-6 py-4 cursor-pointer text-base text-[#1a1a1a] no-underline w-full last:border-b-0 hover:scale-[0.85] transition-transform duration-500 ease-in-out">
                        <Image src="/images/icons/sellingIcon.png" alt="icon" width={29} height={29} />
                        <span>Selling</span>
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-4 px-6 py-4 cursor-pointer text-base text-[#1a1a1a] no-underline w-full last:border-b-0 hover:scale-[0.85] transition-transform duration-500 ease-in-out">
                        <Image src="/images/icons/orderIcon.png" alt="icon" width={36} height={36} />
                        <span>Orders</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-4 px-6 py-4 cursor-pointer text-base text-[#1a1a1a] no-underline w-full last:border-b-0 hover:scale-[0.85] transition-transform duration-500 ease-in-out">
                        <Image src="/images/icons/usersIcon.png" alt="icon" width={28} height={28} />
                        <span>Users</span>
                    </Link>
                    <Link href="admin/items" className="flex items-center gap-4 px-6 py-4 cursor-pointer text-base text-[#1a1a1a] no-underline w-full last:border-b-0 hover:scale-[0.85] transition-transform duration-500 ease-in-out">
                        <Image src="/images/icons/ItemsIcon.png" alt="icon" width={27} height={27} />
                        <span>Items</span>
                    </Link>
                    <Link href="admin/filters" className="flex items-center gap-4 px-6 py-4 cursor-pointer text-base text-[#1a1a1a] no-underline w-full last:border-b-0 hover:scale-[0.85] transition-transform duration-500 ease-in-out">
                        <Image src="/images/icons/filtersIcon.png" alt="icon" width={24} height={24} />
                        <span>Filters</span>
                    </Link>
                    <Link href="admin/category" className="flex items-center gap-4 px-6 py-4 cursor-pointer text-base text-[#1a1a1a] no-underline w-full last:border-b-0 hover:scale-[0.85] transition-transform duration-500 ease-in-out">
                        <Image src="/images/icons/categoryIcon.png" alt="icon" width={30} height={30} />
                        <span>Category</span>
                    </Link>
                </div>
                <button onClick={handleLogout} className="flex flex-row items-center gap-6">
                    <span>Log out</span>
                    <Image src="/images/icons/logoutIcon.png" alt='icon' width={36} height={36} />
                </button>
            </div>
        </div>
    )
}
'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const MENU_ITEMS = [
    { href: '/admin/main', icon: '/images/icons/mainIcon.png', label: 'Main', w: 33, h: 33 },
    { href: '/admin/selling', icon: '/images/icons/sellingIcon.png', label: 'Selling', w: 29, h: 29 },
    { href: '/admin/orders', icon: '/images/icons/orderIcon.png', label: 'Orders', w: 36, h: 36 },
    { href: '/admin/users', icon: '/images/icons/usersIcon.png', label: 'Users', w: 28, h: 28 },
    { href: '/admin/items', icon: '/images/icons/ItemsIcon.png', label: 'Items', w: 27, h: 27 },
    { href: '/admin/filters', icon: '/images/icons/filtersIcon.png', label: 'Filters', w: 24, h: 24 },
    { href: '/admin/category', icon: '/images/icons/categoryIcon.png', label: 'Category', w: 30, h: 30 },
]

export default function Menu() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.clear()
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/admin/login')
    }

    return (
        <div>
            <div className='flex grab-2 flex-row justify-top items-top'>
                <div className="bg-[url('/images/admin/mainMenuBackground.png')] flex flex-col items-center w-[402px] h-screen sticky top-0 py-5 border border-[#b0a0d0] overflow-hidden">
                    <h1 className="text-[64px]">LYNE</h1>
                    <h3>Concept store</h3>

                    <div className="flex flex-col flex-1 w-full pl-5 justify-evenly overflow-hidden">
                        {MENU_ITEMS.map(({ href, icon, label, w, h }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center px-6 cursor-pointer text-base text-[#1a1a1a] no-underline hover:scale-[0.85] transition-transform duration-500 ease-in-out"
                            >
                                <div className={`flex items-center gap-4 ${pathname === href ? 'border-b-2 border-black pb-1 pr-16' : ''}`}>
                                    <Image src={icon} alt="icon" width={w} height={h} />
                                    <span>{label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <button onClick={() => handleLogout()} className="flex flex-row items-center gap-6">
                        <span>Log out</span>
                        <Image src="/images/icons/logoutIcon.png" alt='icon' width={36} height={36} />
                    </button>
                </div>
            </div>
        </div>
    )
}
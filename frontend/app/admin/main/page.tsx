'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function MainPage() {
    return (
        <div>
            <div className='mainMenu'>
                <h1 className="text-[64px]">LYNE</h1>
                <h3>Concept store</h3>

                <div className='menuItems flex flex-col flex-1'>
                    <Link href="/mainPage" className="menuItem">
                        <Image src="/images/mainIcon.png" alt="icon" width={33} height={33} />
                        <span>Main</span>
                    </Link>
                    <Link href="/sellingPage" className="menuItem">
                        <Image src="/images/sellingIcon.png" alt="icon" width={29} height={29} />
                        <span>Selling</span>
                    </Link>
                    <Link href="/ordersPage" className="menuItem">
                        <Image src="/images/orderIcon.png" alt="icon" width={36} height={36} />
                        <span>Orders</span>
                    </Link>
                    <Link href="/usersPage" className="menuItem">
                        <Image src="/images/usersIcon.png" alt="icon" width={28} height={28} />
                        <span>Users</span>
                    </Link>
                    <Link href="/ItemsPage" className="menuItem">
                        <Image src="/images/ItemsIcon.png" alt="icon" width={27} height={27} />
                        <span>Items</span>
                    </Link>
                    <Link href="/FiltersPage" className="menuItem">
                        <Image src="/images/filtersIcon.png" alt="icon" width={24} height={24} />
                        <span>Filters</span>
                    </Link>
                    <Link href="/CategoryPage" className="menuItem">
                        <Image src="/images/categoryIcon.png" alt="icon" width={30} height={30} />
                        <span>Category</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 mt-auto">
                        <Image src="/images/logOutIcon.png" alt="icon" width={30} height={30} />
                        <span>Log out</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
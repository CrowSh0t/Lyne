import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full bg-[#F9F9F9] z-50">
      <div className="flex items-center justify-between px-6 h-16">
        {/* бургер з лівої */}
        <div className="flex-1 flex items-center justify-start">
          <button className="p-2">
            <Image src="/images/icons/burgerMenuIcon.png" alt="menu" width={22} height={22} />
          </button>
        </div>


        <div className="flex fixed top-0 left-0 w-full flex-1">
          <div className="flex-2 flex items-center justify-center">
            <Link href={'/'} className="justify-center text-[#2C2B2B] text-2xl">Lyne</Link>
          </div>
          {/* Іконки з правої сторони */}
          <div className="flex items-center justify-end">
            <Link href="/mainPage" className="p-4">
              <Image src="/images/icons/searchIcon.png" alt="icon" width={33} height={33} />
            </Link>
            <Link href="/loginRegisterUser" className="p-4">
              <Image src="/images/icons/usersIcon.png" alt="icon" width={29} height={29} />
            </Link>
            <Link href="/favoritePage" className="p-4">
              <Image src="/images/icons/favoriteIcon.png" alt="icon" width={36} height={36} />
            </Link>
            <Link href="/cartPage" className="p-4">
              <Image src="/images/icons/cartIcon.png" alt="icon" width={36} height={36} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
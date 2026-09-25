'use client'
import { ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLogined, setIsLogined] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [segment, setSegment] = useState('mid');
  const[isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => setIsLogined(!!localStorage.getItem('username'));
    checkAuth();
    setIsMounted(true);
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  if (!isMounted) {
    return <div className="p-4" style={{ width: 29, height: 29 }} />;
  }

  const accountLink = isLogined ? "/myAccount" : "/loginRegisterUser";

  return (
    <div className="fixed top-0 left-0 w-full bg-[#F9F9F9] z-50">
      <div className="flex items-center justify-between px-3 sm:px-6 h-14 sm:h-16">
        <div className="flex items-center justify-start">
          <button>
            <img src="/images/icons/burgerMenuIcon.png" alt="menu" className="w-5 h-5 sm:w-[22px] sm:h-[22px]" 
            onClick={() =>setIsOpen(true)}/>
            {isOpen && (
              <div className="fixed inset-0 z-50 flex justify-start bg-black/30 backdrop-blur-[1px] lg:h-1/2">
                {/* Модальне вікно */}
                <div className="relative flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-xl transition-all">
                  {/* Кнопка закриття */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mb-6 flex items-center gap-2 text-sm font-normal text-black hover:opacity-75 focus:outline-none"
                  >
                    <X className="h-4 w-4 stroke-[1.5]" />
                    <span className="text-base tracking-tight">Close</span>
                  </button>
                  {/* Основні категорії */}
                  <nav className="flex flex-col space-y-2">
                    <a
                      href="/AllProducts"
                      className="text-base font-medium text-black transition-colors hover:text-neutral-600"
                    >
                      View All
                    </a>
                    <a
                      href="/AllProducts?sort=new"
                      className="text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      New
                    </a>
                    <a
                      href="/AllProducts?category=Women"
                      className="flex items-center justify-between text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      <span>Women</span>
                      <ChevronRight className="h-4 w-4 stroke-black stroke-[1.5]" />
                    </a>
                    <a
                      href="/AllProducts?category=Men"
                      className="flex items-center justify-between text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      <span>Men</span>
                      <ChevronRight className="h-4 w-4 stroke-black stroke-[1.5]" />
                    </a>
                    <a
                      href="/AllProducts?category=Kids"
                      className="flex items-center justify-between text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      <span>Kids</span>
                      <ChevronRight className="h-4 w-4 stroke-black stroke-[1.5]" />
                    </a>
                    <a
                      href="/AllProducts?category=Bags%20and%20Wallets"
                      className="flex items-center justify-between text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      <span>Bags and Wallets</span>
                      <ChevronRight className="h-4 w-4 stroke-black stroke-[1.5]" />
                    </a>
                    <a
                      href="/AllProducts?category=Accessories"
                      className="flex items-center justify-between text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      <span>Accessories</span>
                      <ChevronRight className="h-4 w-4 stroke-black stroke-[1.5]" />
                    </a>
                    <a
                      href="/AllProducts?category=Home"
                      className="flex items-center justify-between text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      <span>Home</span>
                      <ChevronRight className="h-4 w-4 stroke-black stroke-[1.5]" />
                    </a >
                  </nav >

                  {/* Розділювач */}
                  <hr className="my-5 border-neutral-200" />

                  {/* Другорядне меню */}
                  <nav className="flex flex-col space-y-2">
                    <a
                      href="/loginRegisterUser"
                      className="text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      Log in
                    </a>
                    <a
                      href="/favorites"
                      className="text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      Wishlist
                    </a>
                  </nav>

                  {/* Розділювач */}
                  <hr className="my-5 border-neutral-200" />

                  {/* Інформаційні посилання */}
                  <nav className="flex flex-col space-y-4">
                    <a
                      href="/AllProducts"
                      className="text-base font-normal text-neutral-400 transition-colors hover:text-black"
                    >
                      Contact
                    </a>
                  </nav>

                  {/* Перемикач внизу (Mid-Segment / Premium) */}
                  <div className="mt-auto pt-8">
                    <div className="flex rounded-lg bg-neutral-400/80 p-1">
                      <button
                        onClick={() => setSegment('mid')}
                        className={`flex-1 rounded-md py-2 text-center text-sm transition-all ${segment === 'mid'
                          ? 'bg-white font-medium text-black shadow-sm'
                          : 'font-normal text-white hover:text-neutral-100'
                          }`}
                      >
                        Mid - Segment
                      </button>
                      <button
                        onClick={() => setSegment('premium')}
                        className={`flex-1 rounded-md py-2 text-center text-sm transition-all ${segment === 'premium'
                          ? 'bg-white font-medium text-black shadow-sm'
                          : 'font-normal text-white hover:text-neutral-100'
                          }`}
                      >
                        Premium
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </button>
        </div>

        <div className="text-[#2C2B2B] text-sm sm:text-base">
          <Link href={'/'}>Lyne</Link>
        </div>

        <div className="flex items-center justify-end">
          <Link href="/mainPage" className="p-1.5 sm:p-2">
            <img src="/images/icons/searchIcon.png" alt="icon" className="w-6 h-6 sm:w-[33px] sm:h-[33px]" />
          </Link>
          <Link href={accountLink} className="p-1.5 sm:p-2">
            <img src="/images/icons/usersIcon.png" alt="icon" className="w-5 h-5 sm:w-[29px] sm:h-[29px]" />
          </Link>
          <Link href="/favorites" className="p-1.5 sm:p-2 xs:block">
            <img src="/images/icons/favoriteIcon.png" alt="icon" className="w-6 h-6 sm:w-[36px] sm:h-[36px]" />
          </Link>
          <Link href="/cart" className="p-1.5 sm:p-4">
            <img src="/images/icons/cartIcon.png" alt="icon" className="w-6 h-6 sm:w-[36px] sm:h-[36px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
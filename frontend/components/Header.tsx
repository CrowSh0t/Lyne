'use client'
import { ChevronRight, X, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from "@/src/app/api/fetchApi/admin";

export default function Header() {
  const [isLogined, setIsLogined] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [segment, setSegment] = useState('mid');
  const [isOpen, setIsOpen] = useState(false);

  // === СТАНИ ПОШУКУ ===
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && products.length === 0 && !isFetching) {
      setIsFetching(true);
      getProducts()
        .then((data) => {
          setProducts(data);
        })
        .catch((err) => console.error("Помилка завантаження товарів:", err))
        .finally(() => setIsFetching(false));
    }
  }, [isSearchOpen, products.length, isFetching]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    
    return products
      .filter(p => p.name?.toLowerCase().includes(lowerQuery))
      .slice(0, 5); 
  }, [searchQuery, products]);

  const totalResultsCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    return products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).length;
  }, [searchQuery, products]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/AllProducts?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const checkAuth = () => setIsLogined(!!localStorage.getItem('username'));
    checkAuth();
    setIsMounted(true);
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  useEffect(() => {
    if (isSearchOpen || isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen, isOpen]);

  if (!isMounted) return <div className="p-4" style={{ width: 29, height: 29 }} />;

  const accountLink = isLogined ? "/myAccount" : "/loginRegisterUser";

  const getProductImage = (product: any) => {
    let url = 
      (Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl) || 
      (Array.isArray(product.imageUrls) ? product.imageUrls[0] : product.imageUrls) ||
      product.images?.[0]?.url || 
      (Array.isArray(product.images) && typeof product.images[0] === 'string' ? product.images[0] : null) ||
      '/images/placeholder.png'; 

    if (typeof url === 'string') {
      if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/images/placeholder')) {
        return url;
      }
      const cleanUrl = url.startsWith('/') ? url : `/${url}`;
      return `http://localhost:5097${cleanUrl}`;
    }

    return '/images/placeholder.png';
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-[#F9F9F9] z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-3 sm:px-6 h-14 sm:h-16 relative">
          
          {/* ЛІВА ЧАСТИНА (Бургер) */}
          <div className="flex items-center justify-start flex-1">
            <button onClick={() => setIsOpen(true)}>
              <img src="/images/icons/burgerMenuIcon.png" alt="menu" className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </button>
            
            {/* ВИЇЗНЕ МЕНЮ (Тут повернуто твої оригінальні розміри lg:h-1/2 та max-w-xs) */}
            {isOpen && (
              <div 
                className="fixed inset-0 z-50 flex justify-start bg-black/30 backdrop-blur-[1px] lg:h-1/2"
                onClick={() => setIsOpen(false)}
              >
                <div 
                  className="relative flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-xl transition-all"
                  onClick={(e) => e.stopPropagation()} 
                >
                  
                  {/* Кнопка закриття (хрестик) */}
                  <button onClick={() => setIsOpen(false)} className="mb-6 flex items-center gap-2 text-sm font-normal text-black hover:opacity-75 focus:outline-none">
                    <X className="h-4 w-4 stroke-[1.5]" />
                    <span className="text-base tracking-tight">Close</span>
                  </button>

                  <div className="flex flex-col flex-1">
                    
                    {/* View All & New */}
                    <div className="flex flex-col items-center space-y-2 mb-6">
                      <Link href="/AllProducts" onClick={() => setIsOpen(false)} className="text-base font-medium text-black">
                        View All
                      </Link>
                      <Link href="/AllProducts?sort=new" onClick={() => setIsOpen(false)} className="text-base text-[#a3a3a3]">
                        New
                      </Link>
                    </div>

                    {/* Категорії */}
                    <div className="flex flex-col w-full space-y-0.5">
                      {[
                        { name: 'Women', href: '/AllProducts?category=Woman' },
                        { name: 'Men', href: '/AllProducts?category=Men' },
                        { name: 'Kids', href: '/AllProducts?category=Kids' },
                        { name: 'Bags and Wallets', href: '/AllProducts?category=Bags' },
                        { name: 'Accessories', href: '/AllProducts?category=Accessories' },
                        { name: 'Home', href: '/AllProducts?category=Home' },
                      ].map(cat => (
                        <Link 
                          key={cat.name} 
                          href={cat.href} 
                          onClick={() => setIsOpen(false)} 
                          className="flex justify-between items-center py-2 group"
                        >
                          <span className="text-[#8e8e8e] text-base group-hover:text-black transition-colors">
                            {cat.name}
                          </span>
                          <ChevronRight className="w-4 h-4 text-black opacity-50 group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>

                    <hr className="my-5 border-gray-200" />

                    {/* Посилання користувача */}
                    <div className="flex flex-col items-center space-y-3">
                      <Link href={accountLink} onClick={() => setIsOpen(false)} className="text-[#8e8e8e] text-base hover:text-black transition-colors">
                        {isLogined ? 'Log out / Account' : 'Log in'}
                      </Link>
                      <Link href="/favorites" onClick={() => setIsOpen(false)} className="text-[#8e8e8e] text-base hover:text-black transition-colors">
                        Wishlist
                      </Link>
                    </div>

                    <hr className="my-5 border-gray-200" />

                    {/* Contact */}
                    <div className="flex flex-col items-center mb-6">
                      <Link href="/myAccount?tab=contact" onClick={() => setIsOpen(false)} className="text-[#8e8e8e] text-base hover:text-black transition-colors">
                        Contact
                      </Link>
                    </div>

                    {/* Перемикач Segment / Premium */}
                    <div className="mt-auto bg-[#b5b5b5] rounded-xl p-1 flex relative w-full h-[45px] shrink-0">
                      <button
                        onClick={() => setSegment('mid')}
                        className={`flex-1 flex justify-center items-center text-sm font-medium rounded-lg transition-all z-10 ${
                          segment === 'mid' ? 'bg-white text-black shadow-sm' : 'text-white'
                        }`}
                      >
                        Mid - Segment
                      </button>
                      <button
                        onClick={() => setSegment('premium')}
                        className={`flex-1 flex justify-center items-center text-sm font-medium rounded-lg transition-all z-10 ${
                          segment === 'premium' ? 'bg-white text-black shadow-sm' : 'text-white'
                        }`}
                      >
                        Premium
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ЦЕНТР (Лого) */}
          <div className="flex-1 text-center text-[#2C2B2B] text-sm sm:text-base font-semibold tracking-wider">
            <Link href={'/'}>LYNE</Link>
          </div>

          {/* ПРАВА ЧАСТИНА (Іконки) */}
          <div className="flex items-center justify-end flex-1">
            <button onClick={() => setIsSearchOpen(true)} className="p-1.5 sm:p-2">
              <img src="/images/icons/searchIcon.png" alt="search" className="w-6 h-6 sm:w-[33px] sm:h-[33px]" />
            </button>
            <Link href={accountLink} className="p-1.5 sm:p-2">
              <img src="/images/icons/usersIcon.png" alt="account" className="w-5 h-5 sm:w-[29px] sm:h-[29px]" />
            </Link>
            <Link href="/favorites" className="p-1.5 sm:p-2 xs:block">
              <img src="/images/icons/favoriteIcon.png" alt="favorites" className="w-6 h-6 sm:w-[36px] sm:h-[36px]" />
            </Link>
            <Link href="/cart" className="p-1.5 sm:p-4">
              <img src="/images/icons/cartIcon.png" alt="cart" className="w-6 h-6 sm:w-[36px] sm:h-[36px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* ФУЛЛСКРІН ПОШУК (Overlay) */}
      {/* ==================================================== */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsSearchOpen(false);
            setSearchQuery('');
          }
        }}
      >
        <div 
          className={`bg-white w-full shadow-2xl transition-transform duration-300 transform ${
            isSearchOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Поле вводу (на всю ширину) */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <Search className="w-6 h-6 text-gray-400 mr-4" />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input
                type="text"
                autoFocus={isSearchOpen}
                placeholder="Що ви шукаєте?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xl lg:text-2xl outline-none placeholder-gray-300 text-black font-light"
              />
            </form>
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Блок з результатами */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              
              {!searchQuery.trim() ? (
                <div className="text-gray-400 text-center py-10 font-light">
                  Введіть назву товару...
                </div>
              ) : isFetching ? (
                <div className="text-gray-400 text-center py-10">Завантаження...</div>
              ) : searchResults.length > 0 ? (
                <>
                  <p className="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
                    {totalResultsCount} результати за запитом: <span className="font-medium text-black">"{searchQuery}"</span>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {searchResults.map((product) => (
                      <Link
                        href={`/product/${product.id}`}
                        key={product.id}
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                        className="flex gap-6 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 group"
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img 
                            src={getProductImage(product)} 
                            alt={product.name}
                            onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        
                        <div className="flex flex-col justify-center">
                          <h3 className="font-semibold text-lg text-black mb-1 group-hover:text-gray-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                            {product.description || "Переглянути деталі товару"}
                          </p>
                          <p className="font-bold text-base text-black">
                            {product.price} ₴
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
                    <button
                      onClick={() => handleSearchSubmit()}
                      className="px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors hover:scale-105 transform duration-200"
                    >
                      View All Results ({totalResultsCount})
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-800 mb-2 font-medium">Нічого не знайдено</p>
                  <p className="text-gray-500">Спробуйте змінити запит або перевірте орфографію.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
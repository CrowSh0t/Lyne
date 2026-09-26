'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SmallProductCard from '@/components/SmallProductCard';
import { useLoading } from './context/LoadingContext';
import { components } from "@/src/types/schema";
import { getBrands, getProducts } from './api/fetchApi/admin';

type BrandDto = components["schemas"]["BrandDto"];
type ProductDto = components["schemas"]["ProductDto"];

const sliderData = [
  {
    img: '/images/homePage/firstImageForMainPage.png',
    title: 'LUXURY\nCOLLECTION',
    subtitle: 'Cookie BB Bag in Monogram',
  },
  {
    img: '/images/homePage/secondImageForMainPage.png',
    title: 'Tailored\nLegacy',
    subtitle: 'Sharp Form — Suits that speak without words',
  },
  {
    img: '/images/homePage/thirdImageForMainPage.png',
    title: 'The Workwear\nCode',
    subtitle: 'Stripped back. Styled forward.',
  },
];

const categories = [
  { label: 'WOMEN', href: '/AllProducts?category=Woman', image: '/images/homePage/womenCategory.png' },
  { label: 'MEN', href: '/AllProducts?category=Men', image: '/images/homePage/menCategory.png' },
  { label: 'KIDS', href: '/AllProducts?category=Kids', image: '/images/homePage/kidsCategory.png' },
  { label: 'ACCESSORIES', href: '/AllProducts?category=Accessories', image: '/images/homePage/accessoriesCategory.png' },
];

const defaultImage = '/images/homePage/baseImageForGenderCategory.png';

const mobileCategoryImage = '/images/homePage/mobileCategoryImage.png'; 

const DURATION = 3000;

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [hoveredImage, setHoveredImage] = useState(defaultImage);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [brands, setBrands] = useState<Record<number, string>>({});
  const { setLoading } = useLoading();

  const uniqueProducts = products.reduce((acc, p) => {
    const existing = acc.find(x => x.name === p.name);
    if (!existing) {
      acc.push(p);
    } else if ((p.id || 0) > (existing.id || 0)) {
      return acc.map(x => x.name === p.name ? p : x);
    }
    return acc;
  }, [] as ProductDto[]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProducts(),
      getBrands()
    ]).then(([prods, brnds]: [ProductDto[], BrandDto[]]) => {
      setProducts(prods);
      const brandMap: Record<number, string> = {};
      brnds.forEach(b => {
        if (b.id != null) brandMap[b.id] = b.name ?? "—";
      });
      setBrands(brandMap);
    }).finally(() => setLoading(false));
  }, []);

  const startTimer = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= DURATION) {
        setCurrent((prev) => {
          const next = (prev + 1) % sliderData.length;
          startTimer(next);
          return next;
        });
      }
    }, 16);
  };

  useEffect(() => {
    startTimer(0);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleClick = (index: number) => {
    setCurrent(index);
    startTimer(index);
  };

  return (
    <div>
      {/* Верхній cover */}
      <div
        className="relative h-[55vh] sm:h-[65vh] lg:h-[calc(100vh-80px)] pt-[80px] bg-cover bg-center transition-all duration-700 flex items-center"
        style={{ backgroundImage: `url('${sliderData[current].img}')` }}
      >
        {/* Текстовий блок */}
        <div className="pl-6 sm:pl-10 lg:pl-16 max-w-[90%] sm:max-w-[70%] lg:max-w-[55%] flex flex-col gap-2 sm:gap-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-white transition-all duration-500 leading-tight whitespace-pre-line">
            {sliderData[current].title}
          </h1>
          <h3 className="text-sm sm:text-lg lg:text-2xl text-white transition-all duration-500">
            {sliderData[current].subtitle}
          </h3>
        </div>

        {/* Кнопки-індикатори (тільки десктоп) */}
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-10 hidden lg:flex gap-3 items-center">
          {sliderData.map((_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 border ${
                i === current
                  ? 'border-[#D9D9D9]/50 bg-[#FFFFFF80]/50 text-[#2C2B2B] scale-[1.4]'
                  : 'border-[#D9D9D9]/50 bg-[#FFFFFF80]/50 text-[#2C2B2B]/70'
              }`}
            >
              <span className="relative z-10 text-sm">{i + 1}</span>
              <div
                className={`absolute top-0 left-0 h-full bg-white ${
                  hoveredIndex === i ? 'w-full' : 'transition-none'
                }`}
                style={
                  hoveredIndex !== i
                    ? { width: i === current ? `${progress}%` : '0%' }
                    : undefined
                }
              />
            </button>
          ))}
        </div>

        {/* Крапки-індикатори (мобільна версія) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
          {sliderData.map((_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'bg-white w-5' : 'bg-white/50'
              }`}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Середній cover із категоріями */}
      <div className="flex flex-row lg:h-[800px] pt-6 lg:pt-[38px] px-6 sm:px-10 lg:px-0">
        {/* Ліва частина — текст */}
        <div className="flex flex-col lg:pl-[180px]">
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: '#7B8487' }}>
            SHOP BY CATEGORY
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight text-[#7B8487] hover:text-black transition-all duration-200 cursor-pointer w-fit"
              onMouseEnter={() => setHoveredImage(cat.image)}
              onMouseLeave={() => setHoveredImage(defaultImage)}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Права частина — картинка (desktop, реагує на hover) */}
        <div className="hidden lg:block lg:ml-auto lg:h-full">
          <img src={hoveredImage} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Права частина — картинка (mobile, статична) */}
        <div className="mt-6 lg:hidden sm:h-[400px] w-full pl-2">
          <img src={mobileCategoryImage} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Cover із брендами */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 sm:px-10 lg:px-16 py-8">
        <Link href="/AllProducts?search=Dior" className="transition-transform duration-300 hover:scale-105">
          <img src="/images/homePage/DiorBrand.png" alt="Dior" className="h-10 sm:h-16 lg:h-[149px] w-auto" />
        </Link>
        <Link href="/AllProducts?search=Prada" className="transition-transform duration-300 hover:scale-105">
          <img src="/images/homePage/PradaBrand.png" alt="Prada" className="h-10 sm:h-16 lg:h-[233px] w-auto" />
        </Link>
        <Link href="/AllProducts?search=Hermes" className="transition-transform duration-300 hover:scale-105">
          <img src="/images/homePage/HermesBrand.png" alt="Hermes" className="h-10 sm:h-16 lg:h-[189px] w-auto" />
        </Link>
        <Link href="/AllProducts?search=Gucci" className="transition-transform duration-300 hover:scale-105">
          <img src="/images/homePage/GucciBrand.png" alt="Gucci" className="h-10 sm:h-16 lg:h-[142px] w-auto" />
        </Link>
        <Link href="/AllProducts?search=Cartier" className="transition-transform duration-300 hover:scale-105">
          <img src="/images/homePage/CartierBrand.png" alt="Cartier" className="h-10 sm:h-16 lg:h-[209px] w-auto" />
        </Link>
      </div>

      {/* Заголовок "New arrivals" */}
      <div className="px-6 sm:px-9 flex flex-row sm:items-center gap-3 sm:gap-0 sm:h-[63px] mb-4 sm:mb-0">
        <button className="text-left text-2xl sm:text-3xl lg:text-[50px] relative w-fit sm:w-[440px]
        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#2C2B2B] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-800 after:origin-left">
          New arrivals
        </button>

        <Link
          className="text-left text-base sm:text-xl lg:text-[28px] flex ml-auto items-center gap-2"
          href={'/AllProducts'}
        >
          View All
          <img src="/images/icons/ViewAllBtn.png" alt="" className="w-8 h-6 sm:w-[60px] sm:h-[40px]" />
        </Link>
      </div>

      {/* Лінія із колекцією одягу */}
      <div className="py-6 sm:py-9">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto px-6 sm:px-9 lg:px-0 pb-4">
          {uniqueProducts.map(product => (
            <Link key={product.id} href={`/product/${product.id}`} className="shrink-0">
              <SmallProductCard
                key={product.id}
                product={product}
                brandName={brands[product.brandId || 0] ?? ''}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
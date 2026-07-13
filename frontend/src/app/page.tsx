'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useLoading } from './context/LoadingContext';
import { components } from './api/schema';
import { getBrands, getProducts } from './api/fetchApi/admin';

type BrandDto = components["schemas"]["BrandDto"];
type ProductDto = components["schemas"]["ProductDto"];


// Додаємо поля для h1 та h3 у дані слайдера
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
  { label: 'WOMEN', href: '/women', image: '/images/homePage/womenCategory.png' },
  { label: 'MEN', href: '/men', image: '/images/homePage/menCategory.png' },
  { label: 'KIDS', href: '/kids', image: '/images/homePage/kidsCategory.png' },
  { label: 'ACCESSORIES', href: '/accessories', image: '/images/homePage/accessoriesCategory.png' },
];

const defaultImage = '/images/homePage/baseImageForGenderCategory.png';

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
        className="relative w-full h-[calc(100vh-80px)] pt-[80px] bg-cover bg-center transition-all duration-700 flex items-center"
        style={{ backgroundImage: `url('${sliderData[current].img}')` }}
      >
        {/* Текстовий блок: з лівого боку, по центру вертикалі */}
        <div className="pl-16 max-w-[55%] flex flex-col gap-3">
          {/* Головний заголовок H1 */}
          <h1 className="text-8xl text-[#FFFFFF] transition-all duration-500 leading-tight">
            {sliderData[current].title}
          </h1>
          {/* Підзаголовок H3 */}
          <h3 className="text-2xl text-[#FFFFFF] transition-all duration-500">
            {sliderData[current].subtitle}
          </h3>
        </div>

        {/* Кнопки внизу справа */}
        <div className="absolute bottom-8 right-10 flex gap-3 items-center">
          {sliderData.map((_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 border ${i === current
                ? 'border-[#D9D9D9]/50 bg-[#FFFFFF80]/50 text-[#2C2B2B] scale-[1.4]'
                : 'border-[#D9D9D9]/50 bg-[#FFFFFF80]/50 text-[#2C2B2B]/70'
                }`}
            >
              {/* Текст поверх прогресу */}
              <span className="relative z-10 text-sm">{i + 1}</span>

              {/* Ефект заповнення білим кольором */}
              <div
                className={`absolute top-0 left-0 h-full bg-white ${hoveredIndex === i ? 'w-full' : 'transition-none'
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
      </div>

      {/* cередній cover із категоріями */}
      <div className="flex h-[800px] pt-[38px]">
        {/* Ліва частина — текст по центру */}
        <div className="flex flex-col pl-[180px]">
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: '#7B8487' }}>SHOP BY CATEGORY</p>
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className={`text-8xl  tracking-tight text-[#7B8487] hover:text-black transition-all duration-200 cursor-pointer ${cat.label === 'KIDS' ? ' w-fit' : ''
                }`}
              onMouseEnter={() => setHoveredImage(cat.image)}
              onMouseLeave={() => setHoveredImage(defaultImage)}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Права частина — картинка */}
        <div className="ml-auto">
          <img src={hoveredImage} alt="" width={967} height={800} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* майбутній cover із брендами */}
      <div className="flex items-center justify-center px-16">
        <img src="/images/homePage/DiorBrand.png" alt="" width={199} height={149} className='px-9' />
        <img src="/images/homePage/PradaBrand.png" alt="" width={220} height={233} className='px-9' />
        <img src="/images/homePage/HermesBrand.png" alt="" width={190} height={189} className='px-9' />
        <img src="/images/homePage/GucciBrand.png" alt="" width={228} height={142} className='px-9' />
        <img src="/images/homePage/CartierBrand.png" alt="" width={209} height={209} className='px-9' />
      </div>

      {/*  */}
      <div className='px-9 flex h-[63px]'>
        <button className="text-left text-[50px] relative w-[440px]
        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#2C2B2B] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-800 after:origin-left ">
          New arrivals
        </button>

        <Link className="text-left text-[28px] flex ml-auto items-center justify-center gap-2" href={'/AllProducts'}>
          View All
          <img src="/images/icons/ViewAllBtn.png" alt="" width={60} height={40} />
        </Link>
      </div>

      {/* Лінія із колекцією одягу */}
      <div className='py-9'>
        <div className='py-9 flex gap-4'>
          {uniqueProducts.map(product => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <ProductCard
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
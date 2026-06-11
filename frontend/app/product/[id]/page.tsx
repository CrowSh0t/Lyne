'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import React from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useLoading } from '@/app/context/LoadingContext';

const DURATION = 3000;

interface ProductDto {
    id: number;
    name: string;
    brandId: number;
    imageUrl?: string[];
    colorId: number;
    price: number;
    availableColors: string[];
    availableSizes: string[];
    details: string[];
    matchProductsId: number[];
}

// Для Select size
function SizeSelector({ sizes, selected, onSelect }: {
    sizes: string[];
    selected: string | null;
    onSelect: (s: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='border-b border-gray-300'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-full flex items-center justify-between py-4 text-xl'
            >
                <span>Select your size</span>
                <span className='text-sm'>{selected ?? sizes[0]} {isOpen ? '↑' : '↓'}</span>
            </button>
            {isOpen && (
                <div className='flex flex-col pb-2'>
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => { onSelect(size); setIsOpen(false); }}
                            className='flex items-center justify-between py-3 text-sm w-full'
                        >
                            <span>{size}</span>
                            {(selected ?? sizes[0]) === size && <span>✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Для Product Details / Delivery / Payment
function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='border-b border-gray-300'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-full flex items-center justify-between p-6 text-3xl'
            >
                <span>{title}</span>
                <span>{isOpen ? '↑' : '↓'}</span>
            </button>
            {isOpen && <div className='p-4'>{children}</div>}
        </div>
    );
}

export default function ItemById({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [brands, setBrands] = useState<Record<number, string>>({});
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const colorMap: Record<string, string> = {
        Yellow: '#FFD700',
        White: '#FFFFFF',
        Blue: '#365896',
        Pink: '#CCAAC8',
        Black: '#000000',
        Red: '#FF0000',
        // додай інші кольори за потребою
    };
    const [matchProducts, setMatchProducts] = useState<ProductDto[]>([]);
    const { setLoading } = useLoading();

    //fetch товарів які мечаться
    useEffect(() => {
        if (!product?.matchProductsId?.length) return;
        setLoading(true);
        Promise.all(
            product.matchProductsId.map((id: number) =>
                fetch(`/api/products/${id}`).then(r => r.json())
            )
        ).then(setMatchProducts).finally(() => setLoading(false));
    }, [product?.matchProductsId]);

    //fetch кольорів та розмірів
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const [productRes, statsRes] = await Promise.all([
                fetch(`/api/products/${id}`).then(r => r.json()),
                fetch(`/api/Products/stats/all-grouped`).then(r => r.json()),
            ]);
            const stats = statsRes.find((s: any) => s.name === productRes.name);
            setProduct({
                ...productRes,
                availableColors: stats?.availableColors ?? [],
                availableSizes: stats?.availableSizes ?? [],
            });
        };
        fetchData().finally(() => setLoading(false));
    }, [id]);


    const images = product?.imageUrl ?? [];

    const startTimer = useCallback((index: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(0);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const pct = Math.min((elapsed / DURATION) * 100, 100);
            setProgress(pct);

            if (elapsed >= DURATION) {
                setCurrent(prev => (prev + 1) % images.length);
            }
        }, 16);
    }, [images.length]);

    useEffect(() => {
    if (images.length === 0) return;
    startTimer(current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
}, [current, images.length]);

    const handleClick = (index: number) => {
        setCurrent(index);
        startTimer(index);
    };

    if (!product) return <div>Завантаження...</div>;

    return (
        <div className='flex flex-col pt-18 '>
            <div
                className="relative w-full h-[800px] pt-[80px] bg-cover bg-center transition-all duration-700 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FECBBB, #BAA3A9, #95AEBC)' }}
            >
                <Image src={images[current] || '/placeholder.png'} alt='' width={800} height={0} className='object-contain h-full w-auto p-6'></Image>
                {/* Кнопки */}
                <div className="absolute bottom-8 right-10 flex gap-3 items-center">
                    {images.map((_, i) => (
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
                            <span className="relative z-10 text-sm">{i + 1}</span>
                            <div
                                className={`absolute top-0 left-0 h-full bg-white ${hoveredIndex === i ? 'w-full' : 'transition-none'}`}
                                style={hoveredIndex !== i ? { width: i === current ? `${progress}%` : '0%' } : undefined}
                            />
                        </button>
                    ))}
                </div>
            </div>
            {/* Характеристика товару */}
            <div className='flex items-center gap-2'>
                {/* з ліва */}
                <div>
                    <p className='text-2xl'>here will be brand name</p>
                    <h2 className='text-4xl'>{product.name}</h2>
                    <p className='text-2xl'>{product.price}</p>

                    {/* Size select */}
                    <SizeSelector
                        sizes={product.availableSizes ?? []}
                        selected={selectedSize}
                        onSelect={setSelectedSize}
                    />
                    {/* Colors */}
                    <div>
                        <p className='text-2xl p-4'>Color: {selectedColor ?? product.availableColors[0]}</p>
                        <div className='flex p-4 gap-2'>
                            {(product.availableColors ?? []).map((color) => (
                                <div
                                    key={color}
                                    title={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-[20px] h-[20px] rounded-full border p-2 cursor-pointer ${selectedColor === color ? 'border-black scale-110' : 'border-gray-400'}`}
                                    style={{ backgroundColor: colorMap[color] ?? '#ccc' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* з права */}
                <div className='flex flex-col grad-2 ml-auto'>
                    <div className='p-2 flex flex-row grad-2 p-4'>
                        <button className='bg-black text-white w-[599px] h-[72px] flex flex-row items-center justify-center gap-3 text-2xl p-4'>
                            <Image src={'/images/icons/whiteBagIcon.png'} alt={''} width={33} height={29}></Image>
                            ADD TO BAG
                        </button>
                        <div className="relative w-[57px] h-[72px] rounded-lg p-4" style={{ background: 'linear-gradient(135deg, #FECBBB, #BAA3A9, #95AEBC)' }}>
                            <button onClick={() => setIsFavorite(!isFavorite)}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <svg
                                    width={40}
                                    height={40}
                                    viewBox="0 0 24 24"
                                    fill={isFavorite ? "white" : "none"}
                                    stroke={isFavorite ? "white" : "white"}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button className='w-[663px] h-[75px] border-2 flex items-center justify-center'>
                        <Image src={'/images/icons/applePayIcon.png'} alt={''} width={90} height={37} />
                    </button>
                    {/* Внизу з права */}
                    <div>
                        <p className='py-12 text-4xl'>{product.details}</p>
                        <AccordionItem title='PRODUCT DETAILS'>
                            <ul className='space-y-1 text-2xl list-disc list-inside'>
                                <li>{product.details}</li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem title='DILIVERY & RETURNS'>
                            <p className='text-2xl'>Some will be nere</p>
                        </AccordionItem>
                        <AccordionItem title='PAYMENT OPTIONS'>
                            <p className='text-2xl'>Some will be nere</p>
                        </AccordionItem>
                    </div>
                </div>

            </div>
            {/* Complete the look */}
            <div className='py-9'>
                <h2 className='text-center text-2xl tracking-widest mb-8'>Complete the Look</h2>
                <div className='py-9 flex gap-8 justify-center'>
                    {matchProducts.map(p => (
                        <Link key={p.id} href={`/product/${p.id}`}>
                            <ProductCard
                                key={p.id}
                                product={p}
                                brandName={brands[p.brandId] ?? ''}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 72
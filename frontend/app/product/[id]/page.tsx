'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import React from 'react';

const DURATION = 3000;

interface ProductDto {
    id: number;
    name: string;
    brandId: number;
    imageUrl?: string[];
    colorId: number;
    price: number;
}

export default function ItemById({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const [isFavorite, setIsFavorite] = useState(false);
    const colorNames: Record<number, string> = {
        0: 'Yellow',
        1: 'Red',
        2: 'Green',
        3: 'Blue',
        4: 'Black',
        5: 'White',
        6: 'Pink',
        7: 'Purple',
        8: 'Orange',
    };

    // Fetch товару
    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(r => r.json())
            .then(setProduct);
    }, [id]);

    const images = product?.imageUrl ?? [];

    const startTimer = (index: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(0);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const pct = Math.min((elapsed / DURATION) * 100, 100);
            setProgress(pct);

            if (elapsed >= DURATION) {
                setCurrent(prev => {
                    const next = (prev + 1) % images.length;
                    startTimer(next);
                    return next;
                });
            }
        }, 16);
    };

    useEffect(() => {
        if (images.length > 0) {
            startTimer(0);
            return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
        }
    }, [images.length]);

    const handleClick = (index: number) => {
        setCurrent(index);
        startTimer(index);
    };

    if (!product) return <div>Завантаження...</div>;

    return (
        <div className='flex flex-col pt-18 '>
            <div
                className="relative w-full h-[800px] pt-[80px] bg-cover bg-center transition-all duration-700 flex items-center"
                style={{ backgroundImage: images[current] ? `url('${images[current]}')` : 'none' }}
            >
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
                <div>
                    <p className='text-2xl'>here wiil be brand name</p>
                    <h2 className='text-4xl'>{product.name}</h2>
                    <p className='text-2xl'>{product.price}</p>
                    <div className='w-[678px] p-4 flex items-center justify-between'>
                        <label htmlFor="size">Select your size</label>
                        <select className='p-2 rounded' name="size" id="size">
                            <option value="37">37</option>
                            <option value="38">38</option>
                            <option value="39">39</option>
                        </select>
                    </div>
                    <hr />
                    <div>
                        <p className='text-2xl p-4'>Color:{colorNames[product.colorId] ?? 'Unknown'}</p>
                        <div className='flex p-4'>
                            <div className=' w-[20px] h-[20px] bg-white border border-black-500 rounded-full  p-2'></div>
                            <div className=' w-[20px] h-[20px] bg-[#365896] border border-[#365896] rounded-full  items-center justify-center p-2'></div>
                            <div className=' w-[20px] h-[20px] bg-[#CCAAC8] border border-[#CCAAC8] rounded-full items-center justify-center p-2'></div>

                        </div>
                    </div>
                </div>
                <div className='flex flex-col grad-2 ml-auto'>
                    {/* з права */}
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
                </div>
            </div>
        </div>
    );
} 72
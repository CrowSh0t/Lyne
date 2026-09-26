'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import React from 'react';
import SmallProductCard from '@/components/SmallProductCard';
import Link from 'next/link';
import { useLoading } from '@/src/app/context/LoadingContext';
import { components } from "@/src/types/schema";
import { addToFavorites, checkIsFavorite, getBrand,getColors, getCompleteTheLook, getProduct, getProductByName, getSizes, removeFromFavorites } from '../../api/fetchApi/admin';
import AddedToBagModal from '@/components/AddedToBagModal';

type ProductDto = components["schemas"]["ProductDto"];
type BrandDto = components["schemas"]["BrandDto"]
type ColorDto = components["schemas"]["ColorDto"]
type SizeDto = components["schemas"]["SizeDto"]


interface ProductStatsVariant {
    id?: number;
    size: string | null;
    color: string | null;
    count: number;
    price: number;
}
interface ProductStatsDto {
    name: string;
    totalCount: number;
    availableColors: string[];
    availableSizes: string[];
    priceRange: { min: number; max: number };
    variants: ProductStatsVariant[];
}


const DURATION = 3000;

// Для Select size
// Кожен size тепер може бути заблокований (немає в наявності для обраного кольору)
function SizeSelector({ sizes, selected, disabledSizes, onSelect }: {
    sizes: string[];
    selected: string | null;
    disabledSizes: string[];
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
                    {sizes.map((size) => {
                        const isDisabled = disabledSizes.includes(size);
                        return (
                            <button
                                key={size}
                                disabled={isDisabled}
                                onClick={() => { if (!isDisabled) { onSelect(size); setIsOpen(false); } }}
                                className={`flex items-center justify-between py-3 text-sm w-full ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                <span>{size}</span>
                                {(selected ?? sizes[0]) === size && <span>✓</span>}
                            </button>
                        );
                    })}
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

    // product - конкретний товар (colorName+sizeName), відкритий за id з url
    const [product, setProduct] = useState<ProductDto>();
    // stats - агрегована інфа по всіх товарах з таким же name (усі колір/розмір комбінації)
    const [stats, setStats] = useState<ProductStatsDto | null>(null);
    const [brand, setBrand] = useState<BrandDto>();
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [matchProducts, setMatchProducts] = useState<ProductDto[]>([]);
    const [colors, setColors] = useState<ColorDto[]>([]);
    const [sizes, setSizes] = useState<SizeDto[]>([]);
    const [variantImages, setVariantImages] = useState<Record<number, string[]>>({});
    const [bagItems, setBagItems] = useState<ProductDto[] | null>(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        getProduct(id)
            .then((productData) => {
                setProduct(productData);
                if (productData.id != null && productData.imageUrl?.length) {
                    setVariantImages(prev => ({ ...prev, [productData.id as number]: productData.imageUrl as string[] }));
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const variants = stats?.variants ?? [];

    useEffect(() => {
        if (!product) return;
        const matchingVariant = variants.find(v => v.id === product.id);
        if (matchingVariant) {
            setSelectedColor(matchingVariant.color);
            setSelectedSize(matchingVariant.size);
        } else {
            setSelectedColor(product.colorName ?? null);
            setSelectedSize(product.sizeName ?? null);
        }
    }, [product?.id, variants]);

    useEffect(() => {
        if (!product?.name) return;
        setLoading(true);
        getProductByName(encodeURIComponent(product.name))
            .then((data) => {
                const statsData = data as unknown as ProductStatsDto;
                setStats(statsData);
            })
            .catch(() => {
                setStats({
                    name: product.name ?? '',
                    totalCount: 1,
                    availableColors: product.colorName ? [product.colorName] : [],
                    availableSizes: product.sizeName ? [product.sizeName] : [],
                    priceRange: { min: product.price ?? 0, max: product.price ?? 0 },
                    variants: [{
                        id: product.id,
                        size: product.sizeName ?? null,
                        color: product.colorName ?? null,
                        count: 1,
                        price: product.price ?? 0,
                    }],
                });
            })
            .finally(() => setLoading(false));
    }, [product?.name]);

    useEffect(() => {
        if (!product) return;
        setLoading(true);
        Promise.all([
            getBrand(String(product.brandId ?? 0)),
            getSizes(),
            getColors(),
        ]).then(([brandData, sizesData, colorsData]: [BrandDto, SizeDto[], ColorDto[]]) => {
            setBrand(brandData);
            setSizes(sizesData);
            setColors(colorsData);
        }).finally(() => setLoading(false));
    }, [product?.brandId]);

    useEffect(() => {
        if (!product?.matchProductsId?.length) return;
        setLoading(true);
        Promise.all(
            product.matchProductsId.map((matchId: number) =>
                fetch(`/api/products/${matchId}`).then(r => r.json())
            )
        ).then(setMatchProducts).finally(() => setLoading(false));
    }, [product?.matchProductsId]);


    useEffect(() => {
    if (!product?.id) return;
    setLoading(true);
    getCompleteTheLook(product.id)
        .then(setMatchProducts)
        .catch(() => setMatchProducts([]))
        .finally(() => setLoading(false));
}, [product?.id]);

    // --- Групування варіантів ---

    const availableColors = stats?.availableColors ?? [];
    const availableSizes = stats?.availableSizes ?? [];

    const availableSizesForColor = useMemo(() => {
        if (selectedColor == null) return availableSizes;
        const list = variants
            .filter(v => v.color === selectedColor)
            .map(v => v.size)
            .filter((v): v is string => !!v);
        return Array.from(new Set(list));
    }, [variants, selectedColor, availableSizes]);

    // Розміри, які треба заблокувати для обраного кольору
    const disabledSizeNames = useMemo(() => {
        return availableSizes.filter(size => !availableSizesForColor.includes(size));
    }, [availableSizes, availableSizesForColor]);

    // Поточний обраний варіант товару = конкретна комбінація color+size
    const selectedVariant = useMemo(() => {
        return (
            variants.find(v => v.color === selectedColor && v.size === selectedSize)
            ?? variants.find(v => v.color === selectedColor)
            ?? variants[0]
        );
    }, [variants, selectedColor, selectedSize]);

    // Коли міняється обраний варіант - підвантажуємо саме його фото, якщо ще не закешовані
    useEffect(() => {
        const variantId = selectedVariant?.id;
        if (variantId == null || variantImages[variantId]) return;
        setLoading(true);
        getProduct(String(variantId))
            .then((variantProduct) => {
                setVariantImages(prev => ({ ...prev, [variantId]: variantProduct.imageUrl ?? [] }));
            })
            .finally(() => setLoading(false));
    }, [selectedVariant?.id]);

    // Фото поточного варіанту (якщо ще не завантажені - фолбек на фото товару, відкритого за id)
    const images = useMemo(() => {
        if (selectedVariant?.id != null && variantImages[selectedVariant.id]) {
            return variantImages[selectedVariant.id];
        }
        return product?.imageUrl ?? [];
    }, [selectedVariant?.id, variantImages, product?.imageUrl]);

    // При зміні набору фото повертаємось на першу картинку
    useEffect(() => {
        setCurrent(0);
    }, [images]);

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

    useEffect(() => {
        if (!selectedVariant?.id) return;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;
        setLoading(true);
        checkIsFavorite(selectedVariant.id)
            .then(setIsFavorite)
            .finally(() => setLoading(false))
            .catch(() => { });
    }, [selectedVariant?.id]);

    const handleToggleFavorite = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) { alert('Увійдіть щоб додати в улюблені'); return; }
        if (!selectedVariant?.id) return;

        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                try {
                    await removeFromFavorites(selectedVariant.id);
                } catch (err: any) {
                    // 404 — товару вже немає в улюблених, просто синхронізуємо стейт
                    if (err.message.includes('404') || err.message.includes('not in favorites')) {
                        // нічого не робимо, нижче setIsFavorite(false)
                    } else throw err;
                }
                setIsFavorite(false);
            } else {
                try {
                    await addToFavorites(selectedVariant.id);
                    setIsFavorite(true);
                } catch (err: any) {
                    if (err.message.includes('409') || err.message.includes('already')) {
                        setIsFavorite(true);
                    } else throw err;
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFavoriteLoading(false);
        }
    };
    const handleClick = (index: number) => {
        setCurrent(index);
        startTimer(index);
    };

    // Обрати колір: якщо поточний розмір недоступний для нового кольору - переключаємось на перший доступний
    const handleSelectColor = (color: string) => {
        setSelectedColor(color);
        const sizesForColor = variants
            .filter(v => v.color === color)
            .map(v => v.size)
            .filter((v): v is string => !!v);
        if (selectedSize == null || !sizesForColor.includes(selectedSize)) {
            setSelectedSize(sizesForColor[0] ?? null);
        }
    };

    const handleSelectSize = (size: string) => {
        setSelectedSize(size);
    };

    if (!product) return <div>Завантаження...</div>;

    const displayPrice = selectedVariant?.price ?? product.price;


    const handleAddToBag = async () => {
        if (!selectedVariant?.id) {
            alert("Будь ласка, оберіть варіант товару");
            return;
        }

        setLoading(true);

        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : null;

            const headers: HeadersInit = {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const payload = {
                productId: selectedVariant.id,
                quantity: 1,
            };

            console.log(payload);
            
            const res = await fetch("/api/cart", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    productId: selectedVariant.id,
                    quantity: 1,
                }),
            });

            if (!res.ok) {
                throw new Error("Не вдалося додати товар у кошик");
            }

            const cartRes = await fetch("/api/cart", {
                method: "GET",
                headers,
            });

            if (!cartRes.ok) {
                throw new Error("Не вдалося отримати кошик");
            }

            const cartData: ProductDto[] = await cartRes.json();
            setBagItems(cartData);
            console.log(cartData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col pt-18'>
            <div
                className="relative w-full h-[800px] pt-[80px] bg-cover bg-center transition-all duration-700 flex items-center justify-center"
                style={{
                    background:
                        'linear-gradient(135deg, rgba(254, 203, 187, 0.8), rgba(186, 163, 169, 0.8), rgba(149, 174, 188, 0.8))'
                }}
            >
                <img src={images[current] || '/placeholder.png'} alt='' width={800} height={0} className='object-contain h-full w-auto p-6' />
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
            <div className='flex items-center gap-2 pl-12'>
                {/* з ліва */}
                <div className="self-start w-1/2 p-6">
                    <p className="text-2xl">{brand?.name ?? product?.brandId}</p>
                    <h2 className="text-4xl">{product?.name}</h2>
                    <p className="text-2xl">{displayPrice}</p>

                    {/* Size select */}
                    <SizeSelector
                        sizes={availableSizes}
                        selected={selectedSize}
                        disabledSizes={disabledSizeNames}
                        onSelect={handleSelectSize}
                    />

                    {/* Colors */}
                    <div>
                        <p className="text-2xl p-4">
                            Color: {selectedColor ?? ''}
                        </p>

                        <div className="flex p-4 gap-2">
                            {availableColors.map((color) => {
                                const colorInfo = colors.find(c => c.name === color);

                                return (
                                    <div
                                        key={color}
                                        title={color}
                                        onClick={() => handleSelectColor(color)}
                                        className={`w-[20px] h-[20px] rounded-full border p-2 cursor-pointer ${selectedColor === color
                                                ? 'border-black scale-110'
                                                : 'border-gray-400'
                                            }`}
                                        style={{
                                            backgroundColor: colorInfo?.hexCode ?? '#ccc'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* з права */}
                <div className='flex flex-col grad-2 ml-auto w-1/2 px-4'>
                    <div className="p-4 flex flex-row gap-3">
                        <button
                            onClick={() => handleAddToBag()}
                            className="flex-1 bg-black text-white p-3 flex items-center justify-center gap-2 text-sm font-medium tracking-wide"
                        >
                            <img
                                src="/images/icons/whiteBagIcon.png"
                                alt=""
                                width={33}
                                height={29}
                            />
                            ADD TO BAG
                        </button>

                        {bagItems && (
                            <AddedToBagModal
                                items={bagItems}
                                onClose={() => setBagItems(null)}
                            />
                        )}

                        <div
                            className="relative w-[57px] h-[72px] rounded-lg"
                            style={{
                                background:
                                    'linear-gradient(135deg, #FECBBB, #BAA3A9, #95AEBC)',
                            }}
                        >
                            <button
                                onClick={handleToggleFavorite}
                                disabled={favoriteLoading}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <svg
                                    width={40}
                                    height={40}
                                    viewBox="0 0 24 24"
                                    fill={isFavorite ? "white" : "none"}
                                    stroke="white"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        opacity: favoriteLoading ? 0.5 : 1,
                                    }}
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button className='h-[75px] border-2 p-4 flex items-center justify-center'>
                        <img
                            src="/images/icons/applePayIcon.png"
                            alt=""
                            width={90}
                            height={37}
                            className="object-contain"
                        />
                    </button>
                    {/* Внизу з права */}
                    <div>
                        <p className='py-12 text-4xl'>{product?.details}</p>
                        <AccordionItem title='PRODUCT DETAILS'>
                            <ul className='space-y-1 text-2xl list-disc list-inside'>
                                <li>{product?.details}</li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem title='DILIVERY & RETURNS'>
                            <p className='text-2xl'>Some will be here</p>
                        </AccordionItem>
                        <AccordionItem title='PAYMENT OPTIONS'>
                            <p className='text-2xl'>Some will be here</p>
                        </AccordionItem>
                    </div>
                </div>

            </div>
            {/* Complete the look */}
            {matchProducts.length > 0 && (
                <div className='py-9'>
                    <h2 className='text-center text-2xl tracking-widest mb-8'>Complete the Look & same products</h2>
                    <div className='py-9 flex gap-8 justify-center'>
                        {matchProducts.map(p => (
                            <Link key={p.id} href={`/product/${p.id}`}>
                                <SmallProductCard
                                    key={p.id}
                                    product={p}
                                    brandName={brand?.name || ''}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
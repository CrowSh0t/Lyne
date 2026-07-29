'use client'
import { useEffect, useMemo, useState } from 'react';
import { components } from "@/src/types/schema";
import { useLoading } from '../context/LoadingContext';
import { getBrands, getCategories, getColors, getProducts, getSizes } from '../api/fetchApi/admin';
import Image from 'next/image';
import Link from 'next/link';
import PriceRangeSlider from '@/components/PriceRangeSlider';
import LargeProductCard from '@/components/LargeProductCard';

type ProductDto = components["schemas"]["ProductDto"]
type BrandDto = components["schemas"]["BrandDto"]
type SizeDto = components["schemas"]["SizeDto"]
type ColorDto = components["schemas"]["ColorDto"]
type CategoryDto = components["schemas"]["CategoryDto"]

// Ключі всіх мульти-вибіркових фільтрів (все, крім ціни — вона діапазон, не набір id)
type FilterKey = 'category' | 'brand' | 'size' | 'color';

export default function GridToggle() {
    const [columns, setColumns] = useState(2);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [sizes, setSizes] = useState<SizeDto[]>([]);
    const [colors, setColors] = useState<ColorDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Один об'єкт для всіх мульти-вибіркових фільтрів замість окремого useState на кожен тип
    const [selectedFilters, setSelectedFilters] = useState<Record<FilterKey, number[]>>({
        category: [],
        brand: [],
        size: [],
        color: [],
    });

    // Ціновий діапазон — окремо, бо це не набір id, а межі
    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

    const { setLoading } = useLoading()

    const toggleSubFilter = (filterName: string) => {
        setActiveFilter(activeFilter === filterName ? null : filterName);
    };

    // ЄДИНА функція для перемикання будь-якого id в будь-якому фільтрі
    const toggleFilter = (key: FilterKey, id: number) => {
        setSelectedFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(id)
                ? prev[key].filter(x => x !== id)
                : [...prev[key], id],
        }));
    };

    const clearAllFilters = () => {
        setSelectedFilters({ category: [], brand: [], size: [], color: [] });
        setPriceRange(null);
    };

    const activeFiltersCount =
        Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0) +
        (priceRange ? 1 : 0);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getProducts(), getBrands(), getSizes(), getColors(), getCategories()
        ]).then(([productsData, brandsData, sizesData, colorsData, categoryData]:
            [ProductDto[], BrandDto[], SizeDto[], ColorDto[], CategoryDto[]]) => {
            setProducts(productsData);
            setBrands(brandsData);
            setSizes(sizesData);
            setColors(colorsData);
            setCategories(categoryData);
        }).finally(() => setLoading(false));
    }, [])

    // Одна функція фільтрації по всіх критеріях одразу (AND-логіка між типами фільтрів)
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            if (selectedFilters.category.length > 0) {
                const match = p.categoriesId?.some(id => selectedFilters.category.includes(id));
                if (!match) return false;
            }
            if (selectedFilters.brand.length > 0) {
                if (!p.brandId || !selectedFilters.brand.includes(p.brandId)) return false;
            }
            if (selectedFilters.size.length > 0) {
                if (!p.sizeId || !selectedFilters.size.includes(p.sizeId)) return false;
            }
            if (selectedFilters.color.length > 0) {
                if (!p.colorId || !selectedFilters.color.includes(p.colorId)) return false;
            }
            if (priceRange) {
                const price = p.price ?? 0;
                if (price < priceRange.min || price > priceRange.max) return false;
            }
            return true;
        });
    }, [products, selectedFilters, priceRange]);

    const sidebarContent = (
        <>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2 text-xl font-normal text-black cursor-pointer'>
                    <span>&lt;</span>
                    <p>New</p>
                </div>
                <button
                    className='lg:hidden text-2xl px-2'
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Закрити"
                >
                    ×
                </button>
            </div>
            <hr className='border-gray-200 mb-4' />
            <div className='border-b border-gray-400 pb-1 mb-4 cursor-pointer'>
                <p className='text-gray-600 font-light text-base'>All</p>
            </div>
            <div className='flex flex-col gap-4 text-gray-400 font-light text-base mb-8'>
                <p className='hover:text-black cursor-pointer transition-colors'>For Her</p>
                <p className='hover:text-black cursor-pointer transition-colors'>For Him</p>
                <p className='hover:text-black cursor-pointer transition-colors'>For kids</p>
                <p className='hover:text-black cursor-pointer transition-colors'>For the Home</p>
            </div>
            <hr className='border-gray-200' />
        </>
    );

    // Допоміжний компонент для однотипних кнопок-чипів фільтра
    const FilterChips = ({
        items,
        filterKey,
    }: {
        items: { id?: number; name?: string | null }[];
        filterKey: FilterKey;
    }) => (
        <div className="py-4 sm:py-6 flex flex-wrap gap-2 animate-fadeIn bg-white">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => toggleFilter(filterKey, item.id ?? 0)}
                    className={`px-3 sm:px-4 py-2 text-xs font-light transition-colors duration-150 ${
                        selectedFilters[filterKey].includes(item.id ?? 0)
                            ? 'bg-black text-white'
                            : 'bg-[#F9F9F9] hover:bg-gray-200 text-gray-800'
                    }`}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );

    return (
        <div className='pt-16 sm:pt-18 flex min-h-screen bg-white text-black font-sans relative'>

            {/* Сайдбар — десктоп, статичний */}
            <div className='hidden lg:flex w-[240px] min-w-[240px] bg-[#F9F9F9] flex-col pt-8 px-6 border-r border-gray-100'>
                {sidebarContent}
            </div>

            {/* Сайдбар — мобільний, висувна панель */}
            {isSidebarOpen && (
                <div className='fixed inset-0 z-40 lg:hidden'>
                    <div className='absolute inset-0 bg-black/40' onClick={() => setIsSidebarOpen(false)} />
                    <div className='absolute left-0 top-0 h-full w-[80%] max-w-[300px] bg-[#F9F9F9] flex flex-col pt-8 px-6 overflow-y-auto'>
                        {sidebarContent}
                    </div>
                </div>
            )}

            <div className='flex-1 p-4 sm:p-6 flex flex-col min-w-0'>
                <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6 border-b border-gray-100 pb-4'>
                    <div className='flex items-center justify-between gap-2 text-sm uppercase tracking-wider text-gray-700 font-light'>
                        <div className='flex items-center gap-4'>
                            <button className='lg:hidden flex items-center gap-1' onClick={() => setIsSidebarOpen(true)}>
                                <span>≡</span> Categories
                            </button>
                            <button onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} className='flex items-center gap-1'>
                                <img src={'/images/icons/filtersIcon.png'} className='w-5 h-5' />
                                <p>Filters & Sort{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</p>
                            </button>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearAllFilters} className='text-gray-400 hover:text-black underline text-xs'>
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 sm:hidden">
                            <button
                                onClick={() => setColumns(1)}
                                className={`p-1 opacity-40 hover:opacity-100 transition-opacity ${columns === 1 ? '!opacity-100' : ''}`}
                            >
                                <Image src={'/images/icons/twoColIcon.png'} alt={'oneCol'} width={20} height={20} />
                            </button>
                            <button
                                onClick={() => setColumns(2)}
                                className={`p-1 opacity-40 hover:opacity-100 transition-opacity ${columns === 2 ? '!opacity-100' : ''}`}
                            >
                                <Image src={'/images/icons/fourColIcon.png'} alt={'twoCol'} width={20} height={20} />
                            </button>
                        </div>
                    </div>

                    <div className="hidden sm:flex gap-2">
                        <button
                            onClick={() => setColumns(2)}
                            className={`p-1 opacity-40 hover:opacity-100 transition-opacity ${columns === 2 ? '!opacity-100' : ''}`}
                        >
                            <Image src={'/images/icons/twoColIcon.png'} alt={'twoCol'} width={24} height={24} />
                        </button>
                        <button
                            onClick={() => setColumns(4)}
                            className={`p-1 opacity-40 hover:opacity-100 transition-opacity ${columns === 4 ? '!opacity-100' : ''}`}
                        >
                            <Image src={'/images/icons/fourColIcon.png'} alt={'fourCol'} width={24} height={24} />
                        </button>
                    </div>
                </div>

                {isFilterPanelOpen && (
                    <div className="transition-all duration-300 py-2 sm:py-4">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center py-3 border-b border-gray-200 text-xs sm:text-sm font-light overflow-x-auto">
                            <button
                                onClick={() => toggleSubFilter('sort')}
                                className={`flex items-center gap-1 py-1 px-2 cursor-pointer whitespace-nowrap ${activeFilter === 'sort' ? 'font-normal border-b border-black' : ''}`}
                            >
                                Sort by <span className="text-[10px] scale-75">{activeFilter === 'sort' ? '▲' : '▼'}</span>
                            </button>
                            <button
                                onClick={() => toggleSubFilter('category')}
                                className={`flex items-center gap-1 py-1 px-2 cursor-pointer whitespace-nowrap ${activeFilter === 'category' ? 'font-normal border-b border-black' : ''}`}
                            >
                                Category{selectedFilters.category.length > 0 ? ` (${selectedFilters.category.length})` : ''} <span className="text-[10px] scale-75">{activeFilter === 'category' ? '▲' : '▼'}</span>
                            </button>
                            <button
                                onClick={() => toggleSubFilter('brand')}
                                className={`flex items-center gap-1 py-1 px-2 cursor-pointer whitespace-nowrap ${activeFilter === 'brand' ? 'font-normal border-b border-black' : ''}`}
                            >
                                Brand{selectedFilters.brand.length > 0 ? ` (${selectedFilters.brand.length})` : ''} <span className="text-[10px] scale-75">{activeFilter === 'brand' ? '▲' : '▼'}</span>
                            </button>
                            <button
                                onClick={() => toggleSubFilter('size')}
                                className={`flex items-center gap-1 py-1 px-2 cursor-pointer whitespace-nowrap ${activeFilter === 'size' ? 'font-normal border-b border-black' : ''}`}
                            >
                                Size{selectedFilters.size.length > 0 ? ` (${selectedFilters.size.length})` : ''} <span className="text-[10px] scale-75">{activeFilter === 'size' ? '▲' : '▼'}</span>
                            </button>
                            <button
                                onClick={() => toggleSubFilter('color')}
                                className={`flex items-center gap-1 py-1 px-2 cursor-pointer whitespace-nowrap ${activeFilter === 'color' ? 'font-normal border-b border-black' : ''}`}
                            >
                                Color{selectedFilters.color.length > 0 ? ` (${selectedFilters.color.length})` : ''} <span className="text-[10px] scale-75">{activeFilter === 'color' ? '▲' : '▼'}</span>
                            </button>
                            <button
                                onClick={() => toggleSubFilter('price')}
                                className={`flex items-center gap-1 py-1 px-2 cursor-pointer whitespace-nowrap ${activeFilter === 'price' ? 'font-normal border-b border-black' : ''}`}
                            >
                                Price{priceRange ? ' (1)' : ''} <span className="text-[10px] scale-75">{activeFilter === 'price' ? '▲' : '▼'}</span>
                            </button>
                        </div>

                        {activeFilter === 'category' && <FilterChips items={categories} filterKey="category" />}
                        {activeFilter === 'brand' && <FilterChips items={brands} filterKey="brand" />}
                        {activeFilter === 'size' && <FilterChips items={sizes} filterKey="size" />}
                        {activeFilter === 'color' && <FilterChips items={colors} filterKey="color" />}

                        {activeFilter === 'price' && (
                            <div className="w-full max-w-2xl font-sans py-4 sm:py-6 px-2 select-none">
                                <PriceRangeSlider onChange={(min, max) => setPriceRange({ min, max })} />
                            </div>
                        )}
                    </div>
                )}

                <div
                    className="grid gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-10 transition-all duration-300"
                    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                >
                    {filteredProducts.map((p) => (
                        <LargeProductCard key={p.id} p={p} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="text-gray-400 text-center py-16">No products match selected filters.</p>
                )}
            </div>
        </div>
    );
}
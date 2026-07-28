'use client'
import { useEffect, useState } from 'react';
import { components } from '../api/schema';
import { useLoading } from '../context/LoadingContext';
import RangeSlider from 'react-bootstrap-range-slider';
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

export default function GridToggle() {
    const [columns, setColumns] = useState(4);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [sizes, setSizes] = useState<SizeDto[]>([]);
    const [colors, setColors] = useState<ColorDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    
    const { setLoading } = useLoading()

    const toggleSubFilter = (filterName: string) => {
        if (activeFilter === filterName) {
            setActiveFilter(null);
        } else {
            setActiveFilter(filterName);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getProducts(),
            getBrands(),
            getSizes(),
            getColors(),
            getCategories()
        ]).then(([productsData, brandsData, sizesData, colorsData,categoryData]: [ProductDto[], BrandDto[], SizeDto[],ColorDto[],CategoryDto[]]) => {
            setProducts(productsData);
            setBrands(brandsData);
            setSizes(sizesData);
            setColors(colorsData);
            setCategories(categoryData);
        }).finally(() => setLoading(false));
    }, [])

    const toggleCategory = (id: number) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const filteredProducts = selectedCategories.length > 0
    ? products.filter(p =>
        p.categoriesId?.some(categoryId => selectedCategories.includes(categoryId))
    )
    : products;

    return (
        <div className='pt-18 flex min-h-screen bg-white text-black font-sans'>
            <div className='w-[240px] min-w-[240px] bg-[#F9F9F9] flex flex-col pt-8 px-6 border-r border-gray-100'>
                <div className='flex items-center gap-2 text-xl font-normal text-black mb-4 cursor-pointer'>
                    <span>&lt;</span>
                    <p>New</p>
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
            </div>

            <div className='flex-1 p-6 flex flex-col'>
                <div className='flex justify-between items-center mb-6 border-b border-gray-100 pb-4'>
                    <div className='flex items-center gap-2 text-sm uppercase tracking-wider text-gray-700 font-light'>
                        <button onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} className='flex'>
                            <img src={'/images/icons/filtersIcon.png'} />
                            <p>Filters & Sort</p>
                        </button>
                    </div>
                    {isFilterPanelOpen && (
                        <div className="transition-all duration-300 py-4">
                            <div className="flex flex-wrap justify-between items-center py-3 border-b border-gray-200 text-sm font-light">

                                <button
                                    onClick={() => toggleSubFilter('sort')}
                                    className={`flex items-center gap-1 py-1 px-2 cursor-pointer ${activeFilter === 'sort' ? 'font-normal border-b border-black' : ''}`}
                                >
                                    Sort by <span className="text-[10px] scale-75">{activeFilter === 'sort' ? '▲' : '▼'}</span>
                                </button>

                                <button
                                    onClick={() => toggleSubFilter('category')}
                                    className={`flex items-center gap-1 py-1 px-2 cursor-pointer ${activeFilter === 'category' ? 'font-normal border-b border-black' : ''}`}
                                >
                                    Category <span className="text-[10px] scale-75">{activeFilter === 'category' ? '▲' : '▼'}</span>
                                </button>
                                <button
                                    onClick={() => toggleSubFilter('brand')}
                                    className={`flex items-center gap-1 py-1 px-2 cursor-pointer transition-all ${activeFilter === 'brand' ? 'font-normal border-b border-black' : ''
                                        }`}
                                >
                                    Brand <span className="text-[10px] scale-75">{activeFilter === 'brand' ? '▲' : '▼'}</span>
                                </button>

                                <button
                                    onClick={() => toggleSubFilter('size')}
                                    className={`flex items-center gap-1 py-1 px-2 cursor-pointer ${activeFilter === 'size' ? 'font-normal border-b border-black' : ''}`}
                                >
                                    Size <span className="text-[10px] scale-75">{activeFilter === 'size' ? '▲' : '▼'}</span>
                                </button>

                                <button
                                    onClick={() => toggleSubFilter('color')}
                                    className={`flex items-center gap-1 py-1 px-2 cursor-pointer ${activeFilter === 'color' ? 'font-normal border-b border-black' : ''}`}
                                >
                                    Color <span className="text-[10px] scale-75">{activeFilter === 'color' ? '▲' : '▼'}</span>
                                </button>

                                <button
                                    onClick={() => toggleSubFilter('price')}
                                    className={`flex items-center gap-1 py-1 px-2 cursor-pointer ${activeFilter === 'price' ? 'font-normal border-b border-black' : ''}`}
                                >
                                    Price <span className="text-[10px] scale-75">{activeFilter === 'price' ? '▲' : '▼'}</span>
                                </button>
                            </div>
                            {activeFilter === 'category' && (
                                <div className="py-6 flex flex-wrap gap-2 animate-fadeIn bg-white">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => toggleCategory(category.id ?? 0)}
                                            className={`px-4 py-2 text-xs font-light transition-colors duration-150 ${selectedCategories.includes(category.id ?? 0)
                                                    ? 'bg-black text-white'
                                                    : 'bg-[#F9F9F9] hover:bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {activeFilter === 'brand' && (
                                <div className="py-6 flex flex-wrap gap-2 animate-fadeIn bg-white">
                                    {brands.map((brand, idx) => (
                                        <button
                                            key={idx}
                                            className="px-4 py-2 bg-[#F9F9F9] hover:bg-gray-200 text-xs text-gray-800 font-light transition-colors duration-150"
                                        >
                                            {brand.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {activeFilter === 'size' && (
                                <div className="py-6 flex gap-2 bg-white">
                                    {sizes.map((size) => (
                                        <button key={size.id} className="px-4 py-2 bg-[#F9F9F9] text-xs font-light">{size.name}</button>
                                    ))}
                                </div>
                            )}
                            {activeFilter === 'color' && (
                                <div className="py-6 flex gap-2 bg-white">
                                    {colors.map((color) => (
                                        <button key={color.id} className="px-4 py-2 bg-[#F9F9F9] text-xs font-light">{color.name}</button>
                                    ))}
                                </div>
                            )}
                            {activeFilter === 'price' &&(
                                <div className="w-full max-w-2xl font-sans py-6 px-2 select-none">
                                    <PriceRangeSlider />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex gap-2">
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
                <div
                    className="grid gap-x-4 gap-y-10 transition-all duration-300"
                    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                >
                    {filteredProducts.map((p) => (
                        <LargeProductCard p={p} />
                    ))}
                </div>
            </div>
        </div>
    );
}
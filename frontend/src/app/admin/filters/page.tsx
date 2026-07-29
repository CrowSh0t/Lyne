'use client'
import { useEffect, useState } from "react";
import SearchElement from "../../../../components/SerchElement";
import { useLoading } from "@/src/app/context/LoadingContext";
import Link from "next/link";
import UniversalCreateModal, { CreateEntityDto } from "../../../../components/CreateWindow";
import { components } from "@/src/types/schema";
import { getBrands, getCategories, getColors, getSizes } from "@/src/app/api/fetchApi/admin";

type BrandDto = components["schemas"]["BrandDto"];
type CategoryDto = components["schemas"]["CategoryDto"];
type SizeDto = components["schemas"]["SizeDto"];
type ColorDto = components["schemas"]["ColorDto"];


const colDesign = "bg-[#F6F6F6] w-1/4 text-4xl p-4"
const sortList = ["Reckmended","Top Rated", "Price Low to Hight", "New Arrivals", "Best Sellers"]
export default function FiltersPage(){
    
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [sizes, setSizes] = useState<SizeDto[]>([]);
    const[colors, setColors] = useState<ColorDto[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'categories' | 'sizes' | 'brands' | 'colors'>('categories');
    const { setLoading } = useLoading();
    useEffect(() => {
        setLoading(true);
        Promise.all([
            getCategories(),
            getBrands(),
            getSizes(),
            getColors(),
        ])
            .then(([categoryData, brandData, sizeData, colorsData]) => {
                setCategories(categoryData || []);
                setBrands(brandData || []);
                setSizes(sizeData || []);
                setColors(colorsData|| []);
            })
            .catch((error) => console.error("Error while getting data:", error))
            .finally(() => setLoading(false));
    }, []);

    const handleSizesDelete = async (id: number) => {
        const res = await fetch(`/api/sizes/${id}`, { method: 'DELETE' });

        if (res.ok) {
            window.location.reload();
            setSizes(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleBrandsDelete = async (id: number) => {
        const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
        if (res.ok) {
            window.location.reload();
            setBrands(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleCategoriesDelete = async (id: number) => {
        const res = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            window.location.reload();
            setCategories(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleColorsDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`/api/colors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
            });
            
            if (res.ok) {
                window.location.reload();
                setColors(prev => prev.filter(p => p.id !== id));
                console.log(`Колір з ID ${id} успішно видалено`);
            }

        } catch (error) {
            console.error('Не вдалося видалити колір:', error);
        }
    };

    const handleCreateItem = async (data: CreateEntityDto) => {
        try {
            const token = localStorage.getItem('token'); // Перевірте, чи токен беруть саме за цим ключем

            const response = await fetch(`/api/${modalType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Помилка при створенні: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`${modalType} успішно створено:`, result);
            window.location.reload();
        } catch (error) {
            console.error(`Не вдалося створити ${modalType}:`, error);
        }
    };

    const openModalFor = (type: 'categories' | 'sizes' | 'brands' | 'colors') => {
        setModalType(type);
        setModalOpen(true);
    };

    return(
        <div className="p-12">
            <SearchElement text="Filters"/>
            <div className="flex flex-row gap-4 py-4 px-2 bg-white">
                <div className={colDesign}> 
                    <div className="flex flex-row items-center justify-between">
                        <h1 className="text-3xl font-semi">Sort by</h1>
                        <button className="ml-auto">
                            <img src="/images/admin/icons/AddFiltersIcon.png" alt="Add" />
                        </button>
                    </div>
                    <div className="flex flex-col py-6 gap-y-6 text-2xl overflow-y-auto">
                        {sortList.map(s => (
                            <div key={s} className="flex flex-row justify-between items-center w-full">
                                <p className="font-medium">{s}</p>
                                <div className="flex items-center gap-x-4">
                                    <Link className="hover:text-black" href={``}>
                                        <img src="/images/admin/icons/editIcon.png" alt="Edit" width={18} height={18} />
                                    </Link>
                                    <button className="hover:text-red-500">
                                        <img src="/images/admin/icons/deleteIcon.png" alt="Delete" width={18} height={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={colDesign}> 
                    <div className="flex flex-row items-center justify-between overflow-y-auto">
                        <h1 className="text-3xl font-semi">Category</h1>
                        <button className="ml-auto" onClick={() => openModalFor('categories')}>
                            <img src="/images/admin/icons/AddFiltersIcon.png" alt="Add" />
                        </button>
                    </div>
                    <div className="flex flex-col py-6 gap-y-6 text-2xl">
                        {categories.map(c => (
                            <div key={c.id} className="flex flex-row justify-between items-center w-full">
                                
                                <p className="font-medium">{c.name}</p>
                                <div className="flex items-center gap-x-4">
                                    <Link className="hover:text-black" href={``}>
                                        <img src="/images/admin/icons/editIcon.png" alt="Edit" width={18} height={18} />
                                    </Link>
                                    <button className="hover:text-red-500" onClick={() => handleCategoriesDelete(c.id || 0)}>
                                        <img src="/images/admin/icons/deleteIcon.png"  alt="Delete" width={18} height={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={colDesign}> 
                    <div className="flex flex-row items-center justify-between overflow-y-auto">
                        <h1 className="text-3xl font-semi">Brands</h1>
                        <button className="ml-auto" onClick={() => openModalFor('brands')}>
                            <img src="/images/admin/icons/AddFiltersIcon.png" alt="Add" />
                        </button>
                    </div>
                    <div className="flex flex-col py-6 gap-y-6 text-2xl">
                        {brands.map(b=> (
                            <div key={b.id} className="flex flex-row justify-between items-center w-full">
                                
                                <p className="font-medium">{b.name}</p>
                                <div className="flex items-center gap-x-4">
                                    <Link className="hover:text-black" href={``}>
                                        <img src="/images/admin/icons/editIcon.png" alt="Edit" width={18} height={18} />
                                    </Link>
                                    <button className="hover:text-red-500" onClick={() => handleBrandsDelete(b.id || 0)}>
                                        <img src="/images/admin/icons/deleteIcon.png" alt="Delete" width={18} height={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={colDesign}> 
                    <div className="flex flex-row items-center justify-between">
                        <h1 className="text-3xl font-semi">Sizes</h1>
                        <button className="ml-auto" onClick={() => openModalFor('sizes')}>
                            <img src="/images/admin/icons/AddFiltersIcon.png" alt="Add" />
                        </button>
                    </div>
                    <div className="flex flex-col py-6 gap-y-6 text-2xl overflow-y-auto">
                        {sizes.map(s=> (
                            <div key={s.id} className="flex flex-row justify-between items-center w-full">
                                
                                <p className="font-medium">{s.name}</p>
                                <div className="flex items-center gap-x-4">
                                    <Link className="hover:text-black" href={``}>
                                        <img src="/images/admin/icons/editIcon.png" alt="Edit" width={18} height={18} />
                                    </Link>
                                    <button className="hover:text-red-500" onClick={() => handleSizesDelete(s.id || 0)}>
                                        <img src="/images/admin/icons/deleteIcon.png" alt="Delete" width={18} height={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={colDesign}> 
                    <div className="flex flex-row items-center justify-between">
                        <h1 className="text-3xl font-semi">Colors</h1>
                        <button className="ml-auto" onClick={() => openModalFor('colors')}>
                            <img src="/images/admin/icons/AddFiltersIcon.png" alt="Add" />
                        </button>
                    </div>
                    <div className="flex flex-col py-6 gap-y-6 text-2xl overflow-y-auto">
                        {colors.map(c=> (
                            <div key={c.id} className="flex flex-row justify-between items-center w-full">
                                
                                <p className="font-medium">{c.name}</p>
                                <div className="flex items-center gap-x-4">
                                    <Link className="hover:text-black" href={``}>
                                        <img src="/images/admin/icons/editIcon.png" alt="Edit" width={18} height={18} />
                                    </Link>
                                    <button className="hover:text-red-500" onClick={() => handleColorsDelete(c.id || 0)}>
                                        <img src="/images/admin/icons/deleteIcon.png" alt="Delete" width={18} height={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <UniversalCreateModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                elementType={modalType} 
                onConfirm={handleCreateItem}            />
        </div>
        
    );
}

'use client'
import { useEffect, useState } from "react";
import SearchElement from "../Components/SerchElement";
import { useLoading } from "@/src/app/context/LoadingContext";
import Link from "next/link";
import UniversalCreateModal from "../Components/CreateWindow";
import type { components } from "@/src/app/api/schema";
import { getBrands, getCategories, getSizes } from "@/src/app/api/fetchApi/admin";

type BrandDto = components["schemas"]["BrandDto"];
type CategoryDto = components["schemas"]["CategoryDto"];
type SizeDto = components["schemas"]["SizeDto"];


const colDesign = "bg-[#F6F6F6] w-1/4 text-4xl p-4"
const sortList = ["Reckmended","Top Rated", "Price Low to Hight", "New Arrivals", "Best Sellers"]
export default function FiltersPage(){
    
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [sizes, setSizes] = useState<SizeDto[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'categories' | 'sizes' | 'brands'>('categories');
    const { setLoading } = useLoading();
    useEffect(() => {
        setLoading(true);
        Promise.all([
            getCategories(),
            getBrands(),
            getSizes(),
        ])
            .then(([categoryData, brandData, sizeData]) => {
                setCategories(categoryData || []);
                setBrands(brandData || []);
                setSizes(sizeData || []);
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
            setCategories(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleCreateItem = async (name: string) => {
        try {
            const response = await fetch(`/api/${modalType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error(`Помилка при створенні: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`${modalType} успішно створено:`, data);
            window.location.reload();
        } catch (error) {
            console.error(`Не вдалося створити ${modalType}:`, error);
        }
    };

    const openModalFor = (type: 'categories' | 'sizes' | 'brands') => {
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
                    <div className="flex flex-col py-6 gap-y-6 text-2xl">
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
                    <div className="flex flex-row items-center justify-between">
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
                    <div className="flex flex-row items-center justify-between">
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
                    <div className="flex flex-col py-6 gap-y-6 text-2xl">
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
            </div>
            <UniversalCreateModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                elementType={modalType} 
                onConfirm={handleCreateItem}
            />
        </div>
        
    );
}

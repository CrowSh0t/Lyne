'use client'
import { useLoading } from "@/src/app/context/LoadingContext";
import { useAdminHeaderStore } from "@/src/app/store/adminHeader";
import Link from "next/link";
import { useEffect, useState } from "react";
import BackElement from "../../../../components/BackToMainPageElem";
import { components } from "@/src/types/schema";
import {getCategories} from "@/src/app/api/fetchApi/admin";
import UniversalCreateModal from "../../../../components/CreateWindow";

type CategoryDto = components["schemas"]["CategoryDto"];


const CATEGORIES = [
    'Mass Market', 'Premium Segment', 'Woman', 'Men', 'Kids', 'Accessories', 'House'
]

export default function Category() {
    const setRightContent = useAdminHeaderStore(s => s.setRightContent)
    const [selected, setSelected] = useState<string[]>([])
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'categories'>('categories');
    const { setLoading } = useLoading();

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

    const openModalFor = (type: 'categories') => {
        setModalType(type);
        setModalOpen(true);
    };


    useEffect(() => {
        setRightContent(<img src={"/images/admin/icons/searchIcon.png"} />)
    }, [])

    const toggle = (name: string) => {
        setSelected(prev =>
            prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
        )
    }

    useEffect(() => {
        setLoading(true);
        getCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        const res = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div>
            <BackElement />
            <div className="p-12">
                <h1 className="text-4xl font-large">Search Category</h1>
                <div className="flex flex-row pt-2">
                    <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded" />
                    <button className="bg-black flex justify-center items-center py-3 text-white w-1/3 text-2xl mt-auto rounded-lg"
                    onClick={() => openModalFor('categories')}>
                        Add the Category
                    </button>
                </div>
                <div>
                    <h1 className="text-4xl font-large pt-6 pb-2">Category</h1>
                    <hr />
                    <div className="flex flex-row flex-wrap">
                        {CATEGORIES.map(name => (
                            <label key={name} className="text-2xl flex items-center gap-2 cursor-pointer px-6 py-2">
                                <input type="checkbox" className="hidden"
                                    checked={selected.includes(name)}
                                    onChange={() => toggle(name)}
                                />
                                <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors
                                    ${selected.includes(name) ? 'bg-black/50' : 'bg-gray-200'}`}
                                >
                                    {selected.includes(name) && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>
                                {name}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="divide-y">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center py-3 px-4 gap-4">
                                {/* фото */}
                                <img
                                    src={cat.imageUrl || ""}
                                    alt={cat.name || ""}
                                    className="w-14 h-14 object-cover"
                                />

                                {/* назва */}
                                <span className="flex-1 text-sm font-medium tracking-widest">
                                    {cat.name}
                                </span>

                                {/* кнопки */}
                                <div className="flex items-center gap-4 text-gray-400">
                                    <button>▾</button>
                                    <Link href={`/admin/category/${cat.id}`}>
                                        <img src="/images/admin/icons/editIcon.png" alt="edit" width={18} height={18} />
                                    </Link>
                                    <button onClick={() =>handleDelete(cat.id || 0)}>
                                        <img src="/images/admin/icons/deleteIcon.png" alt="delete" width={18} height={18} />
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
    )
}
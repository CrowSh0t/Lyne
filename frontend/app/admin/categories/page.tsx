'use client'
import { getCategories } from "@/app/api/fetchApi/adminApi";
import { useLoading } from "@/app/context/LoadingContext";
import { useAdminHeaderStore } from "@/app/store/adminHeader";
import { CategoryDto } from "@/app/types/dto";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Category() {
    const setRightContent = useAdminHeaderStore(s => s.setRightContent)
    const [selected, setSelected] = useState<string[]>([])
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const { setLoading } = useLoading();

    useState(()=>{
        setLoading(true);
        Promise.all([
            getCategories()
        ])
            .then(([categoryData]) => {
                setCategories(categoryData);
            })
            .catch((error) => console.error("Error while getting data:", error))
            .finally(() => setLoading(false));
    })

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

    return (
        <div>
            <div className="p-4">
                <Link href={'/admin/main'}>
                    <img src={'/images/icons/viewAllBtn.png'} alt={''} className='scale-x-[-1] pt-[36px]' width={47} height={34} />
                </Link>
            </div>
            <div className="p-12">
                <h1 className="text-4xl font-large">Search Category</h1>
                <div className="flex flex-row pt-2">
                    <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded" />
                    <button className="bg-black flex justify-center items-center py-3 text-white w-1/3 text-2xl mt-auto rounded-lg">
                        Add the Category
                    </button>
                </div>
                <div>
                    <h1 className="text-4xl font-large pt-6 pb-2">Category</h1>
                    <hr />
                    <div className="flex flex-row flex-wrap">
                        {categories.map(c => (
                            <label key={c.name} className="text-2xl flex items-center gap-2 cursor-pointer px-6 py-2">
                                <input type="checkbox" className="hidden"
                                    checked={selected.includes(c.name)}
                                    onChange={() => toggle(c.name)}
                                />
                                <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors
                                    ${selected.includes(c.name) ? 'bg-black/50' : 'bg-gray-200'}`}
                                >
                                    {selected.includes(c.name) && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>
                                {c.name}
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
                                    src={cat.imageUrl}
                                    alt={cat.name}
                                    className="w-14 h-14 object-cover"
                                />

                                {/* назва */}
                                <span className="flex-1 text-sm font-medium tracking-widest">
                                    {cat.name}
                                </span>

                                {/* кнопки */}
                                <div className="flex items-center gap-4 text-gray-400">
                                    <button>▾</button>
                                    <button>
                                        <img src="/images/admin/icons/editIcon.png" alt="edit" width={18} height={18} />
                                    </button>
                                    <button>
                                        <img src="/images/admin/icons/deleteIcon.png" alt="delete" width={18} height={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
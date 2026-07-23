'use client'
import { useEffect, useState } from "react";
import BackElement from "../../../../../components/BackToMainPageElem";
import { useLoading } from "@/src/app/context/LoadingContext";
import { useRouter } from "next/navigation";
import React from "react";
import PhotoButton, { PhotoSlotValue } from "../../../../../components/PhotoBtn";
import type { components } from "@/src/app/api/schema";
import { getCategories, getCategory} from "@/src/app/api/fetchApi/admin";

type CategoryDto = components["schemas"]["CategoryDto"];




export default function EditCategoty({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [formData, setFormData] = useState<Partial<CategoryDto>>({});
    const [category, setCategory] = useState<CategoryDto>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [subcategories, setSubcategories] = useState<CategoryDto[]>([]);
    const numericId = Number(id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoSlots, setPhotoSlots] = useState<(PhotoSlotValue | undefined)[]>([])
    const { setLoading } = useLoading();

    const uploadFileToServer = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        return URL.createObjectURL(file);
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getCategory(id),
            getCategories(),
        ])
            .then(([categoryData, allCategories]) => {
                setFormData(categoryData);
                setCategory(categoryData);
                setCategories(allCategories);
                setSubcategories(
                    allCategories.filter((c: CategoryDto) => c.parentCategoryId === numericId)
                );
            })
            .catch((error) => console.error("Помилка:", error))
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            const uploadedUrls: string[] = [];
            for (const slot of photoSlots) {
                if (!slot) continue;
                if (slot.file) {
                    const url = await uploadFileToServer(slot.file);
                    uploadedUrls.push(url);
                } else if (slot.url) {
                    uploadedUrls.push(slot.url);
                }
            }
            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    imageUrl: uploadedUrls.length ? uploadedUrls[0] : formData.imageUrl,
                }),
            });

            if (res.ok) {
                alert("Item update succsesful!");
                router.push('/admin/category');
            } else {
                const errorText = await res.text();
                alert(`Category doesn't update: ${errorText}`);
            }
        } catch (error) {
            console.error("Error while item updating:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <BackElement />
            <div className="flex p-4">
                <h1 className="text-4xl">Edit category</h1>
                <div className="flex ml-auto items-center text-center">
                    <span className="p-4">List of the subcategories</span>
                    <button className="border">Add new subcategory +</button>
                </div>
            </div>
            <div className="flex flex-row grab-2">
                <div>
                    <div className="px-4">
                        <div>
                        <p>Name of category</p>
                        <input
                            className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                            value={formData.name ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        </div>
                        <div>
                        <p>Parent category</p>
                        <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none pr-8"
                                value={formData.parentCategoryId ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, parentCategoryId: e.target.value === '' ? null : Number(e.target.value) }))}
                            >
                                <option value="">— without parent category —</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                        </div>
                    </div>
                    <div className="px-4 w-[520px]">
                        <span>Add photo of the category</span>
                        <PhotoButton index={0} size={'xlarge'} imgSrc={category?.imageUrl || ''} onImagesChange={(values) => setPhotoSlots([values[0]])}/>
                        <div className="flex flex-row gap-2 p-4">
                            <button type="button" className="flex flex-row ml-auto">
                                <img src={"/images/admin/icons/uploadFromIcon.png"} alt={""} width={24} height={24} />
                                <span className="pl-2">Upload from your computer</span>
                            </button>
                        </div>
                        <button className="bg-black h-[50px] w-full text-white text-2xl" 
                        onClick={() => handleUpdate()}
                        disabled={isSubmitting}>
                            {isSubmitting ? (
                            <>
                                <span>Updating...</span>
                            </>
                        ) : (
                            'Confirm changes'
                        )}
                        </button>
                    </div>
                </div>
                <div className="pr-40 flex ml-auto">
                    <div >
                        {subcategories.length > 0 ? (
                            subcategories.map((sub) => (
                                <div key={sub.id}>
                                    {sub.name}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">Subcategories absent</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
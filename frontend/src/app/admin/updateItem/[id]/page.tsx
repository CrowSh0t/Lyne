'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/src/app/context/LoadingContext";
import { useAdminHeaderStore } from "@/src/app/store/adminHeader";
import PhotoButton from "../../Components/PhotoBtn";
import type { components } from "@/src/app/api/schema";
import { getBrands, getColors, getProduct} from "@/src/app/api/fetchApi/admin";

type BrandDto = components["schemas"]["BrandDto"];
type ColorDto = components["schemas"]["ColorDto"];
type ProductDto = components["schemas"]["ProductDto"];

export default function UpdateItem({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [formData, setFormData] = useState<Partial<ProductDto>>({});
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [colors, setColors] = useState<ColorDto[]>([]);
    const { setLoading } = useLoading();

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) {
            Promise.all([getColors(), getBrands()]).then(([colors, brands]) => {
                setColors(colors);
                setBrands(brands);
            });
            return;
        }

        setLoading(true);
        Promise.all([
            getColors(),
            getProduct(id),
            getBrands()
        ])
            .then(([colorsData, productData, brandsData]) => {
                setColors(colorsData);
                setProduct(productData);
                setFormData(productData);
                setBrands(brandsData);
            })
            .catch((error) => console.error("Помилка:", error))
            .finally(() => setLoading(false));
    }, [id]);

    const setRightContent = useAdminHeaderStore(s => s.setRightContent)

    useEffect(() => {
        setRightContent(
            <>
            </>
        )
    }, [])

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Item update succsesful!");
                router.push('/admin/items');
            } else {
                const errorText = await res.text();
                alert(`Item doesn't update: ${errorText}`);
            }
        } catch (error) {
            console.error("Error while item updating:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="p-4">
                <Link href={'/admin/items'}>
                    <img src={'/images/icons/viewAllBtn.png'} alt={''} className='scale-x-[-1] pt-[36px]' width={47} height={34} />
                </Link>
            </div>
            <div className="flex flex-row grad-2">
                <div className="p-4 w-1/2">
                    <PhotoButton index={0} size={"small"} imgSrc={product?.imageUrl || []} />
                </div>
                <div className="ml-auto p-4 w-full">
                    <div className="flex flex-row grab-2">
                        <div className="pr-4">
                            <p>Name</p>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                value={formData.name ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
                        </div>

                        <div className="pr-4">
                            <p>Code</p>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                value={formData.productCode ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value }))} />
                        </div>
                    </div>
                    <div className="pr-4">
                        <p>Short description</p>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            value={formData.description ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <div className="relative">
                        <div className="">
                            <h2>Brand</h2>
                            <div className="relative flex items-center">
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none pr-8"
                                    value={formData.brandId ?? ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, brandId: Number(e.target.value) }))}
                                >
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                            </div>
                        </div>
                        <div>
                            <h2>Color</h2>
                            <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none pr-8"
                                value={formData.colorId ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, colorId: Number(e.target.value) }))}
                            >
                                {colors.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                        </div>
                        <div>
                            <h2>Quantity</h2>
                            <input
                                className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                value={formData.stockQuantity ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <h2>Size</h2>
                            <input
                                className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                value={formData.sizeId ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, sizeId: Number(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <h2>Price</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                value={formData.price ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <div>
                        <p>Fabric composition</p>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            value={formData.details ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))} />
                    </div>
                    <button
                        className="bg-black flex justify-center items-center gap-2 py-3 text-white w-full text-2xl mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                <span>Updating...</span>
                            </>
                        ) : (
                            'Confirm changes'
                        )}
                    </button>
                </div>

            </div>

        </div>
    )
}
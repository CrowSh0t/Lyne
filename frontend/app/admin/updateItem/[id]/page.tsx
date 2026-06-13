'use client'
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";
import { useLoading } from "@/app/context/LoadingContext";
import { useAdminHeaderStore } from "@/app/store/adminHeader";

interface ProductDto {
    id: number;
    name: string;
    brandId: number;
    imageUrl?: string[];
    price: number;
    quantity?: number;
    status?: string;
    categoriesId?: number[];
    code?: string;
    description?: string;
    details?: string;
    composition?: string;
    sizeId?: string | null;
    colorId?: number;
}
interface BrandDto {
    id: number;
    name: string;
}


export default function UpdateItem({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`/api/products/${id}`).then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
        ]).then(([prod, brnds]) => {
            setProduct(prod);
            setBrands(brnds);
        }).finally(() => setLoading(false));
    }, [id]);
    
    const setRightContent = useAdminHeaderStore(s => s.setRightContent)
    
        useEffect(() => {
            setRightContent(
                <>
                </>
            )
        }, [])
        

    return (
        <div>
            <div className="p-4">
                <Link href={'/admin/main'}>
                    <Image src={'/images/icons/viewAllBtn.png'} alt={''} className='scale-x-[-1] pt-[36px]' width={47} height={34} />
                </Link>
            </div>
            <div className="flex flex-row grad-2">
                <div className="p-4 w-1/2">
                    {product?.imageUrl?.map((url, i) => (
                        <img key={i} src={url} alt={product.name} className="w-[314px] object-cover rounded" />
                    ))}
                </div>
                <div className="ml-auto p-4 w-full">
                    <div className="flex flex-row grab-2">
                        <div className="pr-4">
                            <p>Name</p>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                defaultValue={product?.name ?? ''} />
                        </div>

                        <div className="pr-4">
                            <p>Code</p>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                defaultValue={product?.code ?? ''} />
                        </div>
                    </div>
                    <div className="pr-4">
                        <p>Short description</p>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            defaultValue={product?.description ?? ''} />
                    </div>
                    <div className="relative">
                        <div className="">
                            <h2>Brand</h2>
                            <div className="relative flex items-center">
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none pr-8"
                                    defaultValue={product?.brandId ?? 0}
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
                            <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none"
                            >
                            </select>
                        </div>
                        <div>
                            <h2>Quantity</h2>
                            <input
                                className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                defaultValue={product?.quantity ?? ''}
                            />
                        </div>
                        <div>
                            <h2>Size</h2>
                            <input
                                className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                defaultValue={product?.sizeId ?? ''}
                            />
                        </div>
                        <div>
                            <h2>Price</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                defaultValue={product?.price} />
                        </div>
                    </div>
                    <div>
                        <p>Fabric composition</p>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            defaultValue={product?.details ?? ''} />
                    </div>
                    <Link href="/admin/items">
                        <button className="bg-black flex justify-center items-center py-3 text-white w-full text-2xl mt-auto">
                            Confirm changes
                        </button>
                    </Link>
                </div>

            </div>

        </div>
    )
}
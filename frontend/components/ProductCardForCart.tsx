"use client";

import { useEffect, useState } from "react";
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { components } from "@/src/types/schema";
import { useLoading } from "@/src/app/context/LoadingContext";
import { getProduct } from "@/src/app/api/fetchApi/admin";

type OrderItemDto = components["schemas"]["OrderItemDto"];
type ProductDto = components["schemas"]["ProductDto"]

export default function ProductCardForCart({ p }: { p: OrderItemDto }) {
    const [quantity, setQuantity] = useState(p.quantity ?? 1);
    const [product, setProduct] = useState<ProductDto>();
    const { setLoading } = useLoading()

    useEffect(() => {
        if (!p) return
        setLoading(true);
        Promise.all([getProduct(String(p.productId))])
            .then(([prodctData]: [ProductDto]) => setProduct(prodctData))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="flex flex-col xs:flex-row bg-white rounded-2xl overflow-hidden shadow-sm w-full sm:w-[298px] lg:w-auto">
            <div className="w-full h-[180px] xs:w-[140px] xs:h-[140px] sm:w-[165px] sm:h-[157px] lg:w-[280px] lg:h-[320px] bg-[#F5F5F3] flex items-center justify-center shrink-0">
                <img src={product?.imageUrl?.[0]} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="flex flex-col justify-between flex-1 p-4 sm:p-6">
                <div>
                    <div className="flex items-start justify-between">
                        <h1 className="text-base sm:text-lg font-medium leading-snug">
                            {product?.name}
                        </h1>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                            <button aria-label="Favorite">
                                <Heart className="w-5 h-5" />
                            </button>
                            <button aria-label="Remove">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">#{product?.productCode}</p>

                    <hr className="my-3 sm:my-4 border-gray-200" />

                    <div className="space-y-2">
                        <h3 className="text-sm">Colour: <span>{product?.colorName}</span></h3>
                        <h3 className="text-sm">Size: <span>{product?.sizeName}</span></h3>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 sm:mt-6">
                    <div className="flex items-center gap-4 border border-gray-300 rounded-full px-4 py-1.5">
                        <button aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm w-4 text-center">{quantity}</span>
                        <button aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <h3 className="text-base sm:text-lg font-medium">{product?.price}UAH</h3>
                </div>
            </div>
        </div>
    );
}
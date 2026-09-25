'use client'
import { components } from "@/src/types/schema"
import { useEffect, useState } from "react"
import { useLoading } from "../context/LoadingContext"
import { getUserFavorites } from "../api/fetchApi/admin"
import LargeProductCard from "@/components/LargeProductCard"
import Link from "next/link"

type UserFavoritesDto = components["schemas"]["UserFavoriteDto"]

export default function Favorites() {
    // Змінив назву з setIsFavorites на setFavorites для зручності
    const [favorites, setFavorites] = useState<UserFavoritesDto[]>([])
    const { setLoading } = useLoading()

    useEffect(() => {
        setLoading(true);
        getUserFavorites()
            .then((data) => {
                console.log('favorites data:', data);
                // Про всяк випадок додаємо || [], якщо бекенд поверне null
                setFavorites(data || []);
            })
            .finally(() => setLoading(false));
    }, []);

    // Відфільтруємо валідні продукти одразу
    const validFavorites = favorites.filter((f) => f.product != null);

    return (
        // min-h-[70vh] гарантує, що контейнер займе мінімум 70% висоти екрану, відштовхуючи футер вниз
        <div className="min-h-[70vh] px-4 pt-[80px] pb-10">
            {validFavorites.length === 0 ? (
                // Дизайн-заглушка для порожнього списку
                <div className="flex flex-col items-center justify-center h-full pt-20">
                    <h2 className="text-2xl font-light tracking-widest mb-4">FAVORITES</h2>
                    <p className="text-gray-500 mb-8">You haven't saved any items yet.</p>
                    <Link href="/AllProducts" className="px-8 py-3 bg-black text-white text-sm tracking-widest hover:bg-gray-800 transition">
                        CONTINUE SHOPPING
                    </Link>
                </div>
            ) : (
                // Твоя оригінальна сітка
                <div
                    className="grid gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-10 transition-all duration-300"
                    style={{ gridTemplateColumns: `repeat(4, minmax(0, 1fr)) ` }}
                >
                    {validFavorites.map((f) => (
                        <Link key={f.id} href={`/product/${f.product?.id}`}>
                            <LargeProductCard p={f.product!} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
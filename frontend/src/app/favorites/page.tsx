'use client'
import { components } from "@/src/types/schema"
import { useEffect, useState } from "react"
import { useLoading } from "../context/LoadingContext"
import { getUserFavorites } from "../api/fetchApi/admin"
import LargeProductCard from "@/components/LargeProductCard"
import Link from "next/link"

type UserFavoritesDto = components["schemas"]["UserFavoriteDto"]

export default function Favorites(){
    const [favorites, setIsFavorites] = useState<UserFavoritesDto[]>([])
    const {setLoading} = useLoading()

    useEffect(() => {
        setLoading(true);
        getUserFavorites()
            .then((data) => {
                console.log('favorites data:', data); // ← додай це
                setIsFavorites(data);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
    <div className="grid gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-10 transition-all duration-300 pt-[80px]"
                    style={{ gridTemplateColumns: `repeat(4, minmax(0, 1fr))` }}>
        {favorites
            .filter((f) => f.product != null)
            .map((f) => (
                <Link key={f.id} href={`/product/${f.product?.id}`}>
                    <LargeProductCard p={f.product!} />
                </Link>
        ))}
    </div>
);
}
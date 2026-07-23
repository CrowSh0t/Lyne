'use client'
import { useEffect, useEffectEvent, useState } from "react";
import { components } from "../api/schema";
import { useLoading } from "../context/LoadingContext";
import { getCartItems } from "../api/fetchApi/admin";
import ProductCardForCart from "@/components/ProductCardForCart";

type CartItem = components["schemas"]["CartItem"]
export default function Cart() {
    const [cart, setCart] = useState<CartItem[]>([])
    const { setLoading } = useLoading()

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getCartItems()
        ]).then(([cartData]: [CartItem[]]) => {
            setCart(cartData)
        }).finally(() => setLoading(false))
    }, []);

    return (
        <div className="pt-16">
            <div className="w-1/2">
            {cart.map((c) => (
                <div key={c.id} className="p-4">
                    {c.product && (
                        <ProductCardForCart
                            p={c.product}
                        />
                    )}
                </div>
            ))}
            </div>
        </div>
    )
}
'use client'
import { useEffect, useState } from "react";
import { components } from "@/src/types/schema";
import { useLoading } from "../context/LoadingContext";
import { createUserOrder, getCartItems } from "../api/fetchApi/admin";
import ProductCardForCart from "@/components/ProductCardForCart";
import Link from "next/link";

type CartItem = components["schemas"]["CartItem"]
type OrderDto = components["schemas"]["OrderDto"]

export default function Cart() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [order, setOrder] = useState<OrderDto>();
    const { setLoading } = useLoading()

    useEffect(() => {
        setLoading(true);
        Promise.all([getCartItems()])
            .then(([cartData]: [CartItem[]]) => setCart(cartData))
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        if (!cart.length) return;
        setLoading(true);
        createUserOrder({
            items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        })
            .then((orderData) => setOrder(orderData))
            .finally(() => setLoading(false));
    }, [cart]);

    return (
        <div className="pt-[80px]">
            <div className="flex items-center text-black justify-center underline">
                <Link href="/AllProducts" className="text-center pt-8 sm:pt-12 pt-[64px] text-sm sm:text-base">
                    Continue Shopping
                </Link>
            </div>

            <div className="pt-2 flex flex-col lg:flex-row px-4 sm:px-6 lg:px-0 gap-6 lg:gap-0" >
                {/* Список товарів */}
                <div className="w-full lg:w-1/2 max-h-[500px] lg:h-[1000px] overflow-y-auto ">
                    {cart.map((c) => (
                        <div key={c.id} className="p-2 sm:p-4 ">
                            {c.product && (
                                <ProductCardForCart
                                    p={{
                                        productId: c.product.id,
                                        productName: c.product.name,
                                        quantity: c.quantity,
                                        unitPrice: c.product.price,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Підсумок замовлення */}
                <div className="flex items-center justify-center w-full lg:w-1/2 lg:ml-auto">
                    <div
                        className="w-full max-w-[672px] lg:h-[892px] flex flex-col justify-between p-2"
                        style={{ background: 'linear-gradient(135deg, #95AEBC, #BAA3A9, #FECBBB)' }}
                    >
                        <div className="text-xl sm:text-2xl lg:text-4xl p-4 sm:p-6">
                            <h3>ORDER SUMMARY</h3>
                            <br />
                            <h1>Subtotal: {cart.length ?? 0} items</h1>
                            <br />
                            <h1>Order amount: {order?.amount ?? 0} UAH</h1>
                            <br />
                            <h1>Shipping cost: Free</h1>
                            <br />
                            <h1>Discount: 0 %</h1>
                            <br />
                            <hr />
                            <h1 className="py-4">Total {order?.amount} UAH</h1>
                        </div>

                        <div className="p-4 sm:p-6 pb-6 sm:pb-8">
                            <Link href="/payment">
                                <button className="bg-black text-white w-full h-[55px] sm:h-[65px] lg:h-[75px] text-base sm:text-lg">
                                    Proceed to Checkout
                                </button>
                            </Link>
                            <h1 className="text-center py-3 sm:py-4 text-lg sm:text-2xl">OR</h1>
                            <div className="flex flex-col gap-3 items-center">
                                <button className="w-full max-w-[300px]">
                                    <img src="/images/cart/ApplePay.svg" className="w-full h-auto" alt="Apple Pay" />
                                </button>
                                <button className="w-full max-w-[300px]">
                                    <img src="/images/cart/GooglePay.svg" className="w-full h-auto" alt="Google Pay" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
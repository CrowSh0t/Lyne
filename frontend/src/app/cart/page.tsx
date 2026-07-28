'use client'
import { useEffect, useEffectEvent, useState } from "react";
import { components } from "../api/schema";
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
        Promise.all([
            getCartItems()
        ]).then(([cartData]: [CartItem[]]) => {
            setCart(cartData)
        }).finally(() => setLoading(false))
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
        <div>
            <div className="flex items-center text-black justify-center underline">
                <Link href="/AllProducts" className="text-center pt-[64px]">
                    Continue Shopping
                </Link>
            </div>
            <div className="pt-2 flex flex-row">
                <div className="w-1/2 h-[1000px] overflow-y-auto">
                    {cart.map((c) => (
                        <div key={c.id} className="p-4">
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
                <div className="flex items-center justify-center w-1/2 ml-auto ">
                    <div className="bg-cover bg-center w-[672px] h-[892px] items-center justify-center p-2"
                        style={{ background: 'linear-gradient(135deg, #95AEBC, #BAA3A9, #FECBBB)' }}
                    >
                        <div className="text-4xl p-6">
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
                            <h1 className="py-4">Total  {order?.amount} UAH</h1>
                        </div>
                        <div className="p-6">
                            <button className="bg-black text-white w-[572px] h-[75px]">
                            <Link  href="/payment" className="w-full h-full text-2xl">Procced to Checkout</Link>
                            </button>
                            <br />
                            <h1 className="text-center py-4 text-2xl">OR</h1>
                            <button>
                                <img src={"/images/cart/ApplePay.svg"}></img>
                            </button>
                            <button className="py-4">
                                <img src={"/images/cart/GooglePay.svg"}></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
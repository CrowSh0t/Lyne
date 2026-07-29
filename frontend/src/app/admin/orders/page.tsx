'use client';
import { useAdminHeaderStore } from '@/src/app/store/adminHeader';
import { useEffect, useState } from 'react';
import { components } from "@/src/types/schema";
import { useLoading } from '../../context/LoadingContext';
import { deleteOrder, getOrders } from '../../api/fetchApi/admin';
import BackElement from '../../../../components/BackToMainPageElem';

type OrderDto = components["schemas"]["OrderDto"];

export default function MainPage() {

    const [orders, setOrders] = useState<OrderDto[]>([]);
    const { setLoading } = useLoading();


    const setRightContent = useAdminHeaderStore(s => s.setRightContent)

    useEffect(() => {
        setRightContent(
            <>
                <img src={"/images/admin/icons/searchIcon.png"} />
            </>
        )
    }, [])

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getOrders()
        ]).then(([ordersData]: [OrderDto[]]) => {
            setOrders(ordersData)
        }).finally(() => setLoading(false));
    }, [])

    const handleDeleteOrder = (id:string) =>{
        deleteOrder(id)
        window.location.reload()
    }

    return (
        <div className="pt-[80px]">
            <BackElement />

            <div className="px-16 w-full max-h-[700px] overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xl border-b border-gray-200">
                            <th className="py-4 px-6 font-normal">Id</th>
                            <th className="py-4 px-6 font-normal">Name</th>
                            <th className="py-4 px-6 font-normal">Amount of money</th>
                            <th className="py-4 px-6 font-normal">Status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map(ord => (
                            <tr
                                key={ord.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="py-4 px-6">
                                    {ord.id || "-"}
                                </td>
                                <td className="py-4 px-6">
                                    {ord.userName || "-"}
                                </td>

                                <td className="py-4 px-6">
                                    {ord.amount || "-"}
                                </td>

                                <td className="py-4 px-6">
                                    {ord.status || "-"}
                                </td>
                                <td>
                                    <button className="hover:text-red-500"
                                    onClick={() =>handleDeleteOrder(String(ord.id))}>
                                        <img src="/images/admin/icons/deleteIcon.png" alt="Delete" width={18} height={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
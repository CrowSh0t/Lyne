'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminHeaderStore } from '@/src/app/store/adminHeader';
import { useEffect, useState } from 'react';
import { components } from '@/src/types/schema'
import { useLoading } from '../../context/LoadingContext';
import { getDiscounts, getOrders } from '@/src/app/api/fetchApi/admin';

type OrderDto = components["schemas"]["OrderDto"];

const stats = [
    { label: "Mounth", image: '/images/admin/MounthStats.png' },
    { label: "Year", image: '/images/admin/YearStats.svg' },
    { label: "Day", image: '/images/admin/DayStats.svg' },
    { label: "Year", image: '/images/admin/WeekStats.svg' },
]

const revenue = [
    { label: "Oct2024-2025", image: '/images/admin/RevenueOct2024_2025.svg' },
    { label: "Oct2023-2024", image: '/images/admin/RevenueOct2023_2024.svg' },
]

const defaultStatsImage = '/images/admin/MounthStats.png';
const defaultRevenueImage = '/images/admin/RevenueOct2023_2024.svg';

export default function MainPage() {

    const setRightContent = useAdminHeaderStore(s => s.setRightContent)
    const [hoverdStatsImage, setHoveredStatsImage] = useState(defaultStatsImage);
    const [hoverdRevenueImage, setHoveredRevenueImage] = useState(defaultRevenueImage);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const { setLoading } = useLoading();

    useEffect(() => {
        setRightContent(
            <>
            </>
        )
    }, [])

    useEffect(() =>{
        setLoading(true);
        Promise.all([
            getOrders()
        ]).then(([ordersData]: [OrderDto[]]) => {
            setOrders(ordersData)
        }).finally(() => setLoading(false));
    },[])

    return (
        <div className='pt-[80px] grab-2 flex-row flex'>
            <div className='p-4'>
                <div>
                    <div className='flex flex-row'>
                        <h1 className='text-3xl p-4'>Your stats</h1>
                        <select className='ml-auto text-3xl'
                            onChange={(e) => {
                                const selected = stats.find(s => s.label === e.target.value);
                                setHoveredStatsImage(selected?.image || '');
                            }}
                        >
                            {stats.map((s) => (
                                <option key={s.label} value={s.label}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Image src={hoverdStatsImage} alt='stats' width={916} height={206} />
                </div>

                <div className='p-4'>
                    <div className='flex flex-row'>
                        <h1 className='text-3xl p-4'>Revenue by mounth</h1>
                        <select className='ml-auto text-3xl'
                            onChange={(e) => {
                                const selected = revenue.find(r => r.label === e.target.value);
                                setHoveredRevenueImage(selected?.image || '');
                            }}
                        >
                            {revenue.map((r) => (
                                <option key={r.label} value={r.label}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Image src={hoverdRevenueImage} alt='revenue' width={916} height={206} />
                </div>
                <div className='max-h-[200px] overflow-y-auto'>
                    <h1 className='text-2xl'>Latest orders</h1>
                    <table>
                        <thead>
                            <tr className='text-left text-xl border-b border-gray-200'>
                                <th className='px-16 font-normal'>Name</th>
                                <th className='px-16 font-normal'>Amount of money</th>
                                <th className='px-16 font-normal'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {orders.map(ord => (
                            <tr key={ord.id} className="border-b border-gray-100 hover:bg-gray-50 ">
                                <td className="py-3 flex items-center gap-3">{ord.userName || "-"}</td>
                                <td className="py-3">{ord.amount || "-"}</td>
                                <td className="py-3 text-gray-400">{ord.status || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
            <div className='p-2'>
                <h1 className='text-3xl'>Decrease in selling</h1>
                
            </div>
        </div>
    );
}
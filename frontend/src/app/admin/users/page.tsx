'use client'
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link'
import { components } from '@/src/types/schema';
import { useLoading } from '../../context/LoadingContext';
import { getUsers } from '@/src/app/api/fetchApi/admin';

type UserDto = components["schemas"]["UserDto"];

export default function Users() {
    const options = ['Last 7 Days', 'Last 20 Days', 'Last 30 Days', 'Last 90 Days'];
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('Last 20 Days');
    const [users, setUsers] = useState<UserDto[]>([]);
    const [search, setSearch] = useState('');
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        getUsers()
            .then(setUsers)
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = useMemo(() =>
        users.filter(u =>
            u.userName?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        ),
        [users, search]
    );

    return (
        <div className='p-[36px]'>
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-3'>
                    <Link href={''}>
                        <img src={'/images/icons/searchIcon.png'} alt={''} width={28} height={28} />
                    </Link>
                    <Link href={''}>
                        <img src={'/images/icons/updateIcon.png'} alt={''} width={32} height={32} />
                    </Link>
                </div>
            </div>

            <Link href={'/admin/main'}>
                <img src={'/images/icons/viewAllBtn.png'} alt={''} className='scale-x-[-1] pt-[36px]' width={47} height={34} />
            </Link>
            <img src={'/images/admin/userStatistic.png'} alt={''} className='py-[16px] px-[8px]' width={1243} height={200} />

            <div className='bg-[##FFFFFF] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] rounded-tl-[5px] rounded-tr-[5px]'>
                <div className='py-[16px] px-[8px]'>
                    <div className='flex items-center'>
                        <h1 className='text-[25px] pr-[16px]'>User Managment</h1>
                        <div className='w-[114px] h-[28px] bg-[#1A1D23] rounded-[5px] text-[#FFFFFF]'>
                            <p className='px-[16px]'>{filteredUsers.length} users</p>
                        </div>
                    </div>
                    <div className='flex h-[50px]'>
                        <input
                            className='w-[816px] bg-[#F6F6F6] pr-[8px] px-3 outline-none'
                            placeholder='Search by name or email...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className='bg-[#F6F6F6] w-[123px] flex items-center mx-4 px-2'>
                            <img src={'/images/icons/filtersIcon.png'} alt={''} width={20} height={20} />
                            <p className='px-3'>Filters</p>
                        </button>
                        <div className="relative bg-[#F6F6F6] w-[123px] flex items-center mx-4 px-2">
                            <button onClick={() => setOpen(!open)}>
                                {selected} &#x2304;
                            </button>
                            {open && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-white z-10">
                                    {options.map(option => (
                                        <div
                                            key={option}
                                            onClick={() => { setSelected(option); setOpen(false); }}
                                            className="cursor-pointer"
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='px-4 py-2 m-3 overflow-y-auto'>
                    <table>
                        <thead>
                            <tr className='text-left text-xl border-b border-gray-200'>
                                <th className='px-16 font-normal'>User</th>
                                <th className='px-16 font-normal'>Email</th>
                                <th className='px-16 font-normal'>City</th>
                                <th className='px-16 font-normal'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(u => (
                                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 text-gray-400">{u.userName ?? "—"}</td>
                                        <td className="py-3 text-gray-400">{u.email ?? "—"}</td>
                                        <td className="py-3 text-gray-400">{u.country ?? "—"}</td>
                                        <td className="py-3 text-gray-400">{u.status ?? "—"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-gray-400">
                                        Користувачів не знайдено
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
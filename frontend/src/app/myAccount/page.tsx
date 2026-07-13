'use client';
import { useEffect, useState } from 'react';

export default function MyAccountPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('serpasswork123');
    const [country, setCountry] = useState('');
    const [editingPass, setEditingPass] = useState(false);


    useEffect(() => {
        setName(localStorage.getItem('username') || '');
        setEmail(localStorage.getItem('email') || '');
        setCountry(localStorage.getItem('country') || '');
    }, []);

    type Tab = 'account' | 'orders' | 'contact'
    const [activeTab, setActiveTab] = useState<Tab>('account')

    const tabs = [
        { id: 'account' as Tab, label: 'My account', icon: '/images/icons/usersIcon.png' },
        { id: 'orders' as Tab, label: 'My orders', icon: '/images/icons/orderIcon.png' },
        { id: 'contact' as Tab, label: 'Contact us', icon: '/images/icons/contactUsIcon.png' },
    ]

    const backgrounds: Record<Tab, string> = {
        account: '/images/userAccount/backgroundForMyAccoutPage.png',
        orders: '/images/userAccount/backgroundForOrders.png',
        contact: '/images/userAccount/backgroundForContact.png',
    }

    return (
        <div className='p-[48px] h-screen bg-[#D2D2D2]'>
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage: `url('${backgrounds[activeTab]}')`,
                    opacity: 0.65,
                }}
            />
            <div className='relative z-10'>
                <h1 className="text-2xl font-medium mb-4">Hello, {name}</h1>

                {/* Таби */}
                <div className="p-[16px] flex flex-row items-center gap-6">
                    {tabs.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex flex-row items-center gap-2 pb-2 border-b-2 transition-colors ${activeTab === id ? 'border-black' : 'border-transparent'
                                }`}
                        >
                            <span>{label}</span>
                            <img src={icon} alt={label} width={20} height={20} />
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            localStorage.removeItem('token')
                            window.location.href = '/'
                        }}
                        className="flex flex-row items-center gap-2 pb-2 border-b-2 border-transparent"
                    >
                        <span>Log out</span>
                        <img src="/images/icons/logoutIcon.png" alt="Log out" width={20} height={20} />
                    </button>
                </div>
                {/* Контент під табами */}
                <div className="mt-6">
                    {activeTab === 'account' && (
                        <div>
                            <h3 className="font-medium mb-3">Personal information</h3>
                            <div className="field pt-[5px]">
                                <input type="email" value={email} readOnly className="input bg-[#F9F9F9] w-[701] h-[50] br-[3] " />
                            </div>
                            <div className="field pt-[25px]">
                                <input
                                    type={editingPass ? "text" : "password"}
                                    value={password}
                                    readOnly={!editingPass}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]"
                                />
                                <button onClick={() => setEditingPass(!editingPass)}>
                                    {editingPass ? "✓" : "✏️"}
                                </button>
                                <div className='pt-[48px]'>
                                    <h3>Your default delivery adress (set a default)</h3>
                                    <div className='pt-[24px] w-1/3'>
                                        <p>Country</p>
                                        <input type="country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                                        <p>City</p>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                                        <p>Postcode</p>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                                        <p>Street</p>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                                        <p>House</p>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="button"
                                                className="bg-[#1A1A1A] text-white text-sm font-medium px-25 py-3 hover:bg-black transition-colors"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="font-medium mb-3">My orders</h2>
                            {/* список замовлень */}
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div>
                            <h2 className="font-medium mb-3">Contact us</h2>
                            {/* форма контакту */}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
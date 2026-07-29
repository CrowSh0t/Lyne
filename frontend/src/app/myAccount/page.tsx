'use client';
import { useEffect, useState } from 'react';
import { components } from "@/src/types/schema";
import { useLoading } from '../context/LoadingContext';
import { deleteOrder, getOrdersbyUserName, getProduct, getProducts, updateOrderStatus } from '../api/fetchApi/admin';
import Link from 'next/link';
import LargeProductCard from '@/components/LargeProductCard';
import ProductCardForCart from '@/components/ProductCardForCart';
import { Mail, Phone, PhoneCall } from 'lucide-react';

type OrderDto = components["schemas"]["OrderDto"]
type ProductDto = components["schemas"]["ProductDto"]

export default function MyAccountPage() {
    const inputBaseStyle = 'w-full bg-gray-50 rounded-lg px-4 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black transition duration-150';
    const inputSmallStyle = 'input bg-[#F9F9F9] w-full h-[45px] sm:h-[50px] rounded-[3px] px-3';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('serpasswork123');
    const [country, setCountry] = useState('');
    const [editingPass, setEditingPass] = useState(false);
    const [orders, setOrders] = useState<OrderDto[]>();
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [cartProducts, setCartProducts] = useState<Record<number, ProductDto>>({});
    const [deliveryInfo, setDeliveryInfo] = useState<Record<string, string>>({});
    const today = new Date().toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const [formData, setFormData] = useState({
        Name: '',
        phone: '',
        email: '',
        text: '',
    });
    const [showCancleOrderModal, setShowCancleOrderModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const firstOrder = orders?.[0];
    const { setLoading } = useLoading();

    useEffect(() => {
        setName(localStorage.getItem('username') || '');
        setEmail(localStorage.getItem('email') || '');
        setCountry(localStorage.getItem('country') || '');
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('userDeliveryInform');
        if (saved) setDeliveryInfo(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (!name) return;
        setLoading(true);
        Promise.all([
            getOrdersbyUserName(name),
            getProducts()
        ]).then(([ordersData, productsData]: [OrderDto[], ProductDto[]]) => {
            setOrders(ordersData);
            setProducts(productsData);
        }).finally(() => setLoading(false));
    }, [name])

    useEffect(() => {
        if (!orders?.length) return;
        const allItems = orders.flatMap(o => o.items ?? []);
        const uniqueIds = [...new Set(allItems.map(i => i.productId).filter(Boolean))] as number[];

        Promise.all(
            uniqueIds.map(id => getProduct(String(id)).then(p => ({ id, product: p })))
        ).then(results => {
            const map: Record<number, ProductDto> = {};
            results.forEach(({ id, product }) => { map[id] = product; });
            setCartProducts(map);
        });
    }, [orders]);

    type Tab = 'account' | 'orders' | 'contact'
    const [activeTab, setActiveTab] = useState<Tab>('account')

    const tabs = [
        { id: 'account' as Tab, label: 'My account', icon: '/images/icons/usersIcon.png' },
        { id: 'orders' as Tab, label: 'My orders', icon: '/images/icons/orderIcon.png' },
        { id: 'contact' as Tab, label: 'Contact us', icon: '/images/icons/contactUsIcon.png' },
    ]

    const backgrounds: Record<Tab, string> = {
        account: '/images/userAccount/backgroundForMyAccoutPage.png',
        orders: '/images/userAccount/BackgroundMyOrder.jpg',
        contact: '/images/userAccount/ContactUsBG.png',
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleInitiateCancel = (id: string) => {
        setSelectedOrderId(id);
        setShowCancleOrderModal(true);
    };

    const handleConfirmCancelOrder = () => {
        if (selectedOrderId) {
            updateOrderStatus(selectedOrderId, 'Cancelled');
            setShowCancleOrderModal(false);
            setSelectedOrderId(null);
            window.location.reload();
        }
    };

    const handleCloseModal = () => {
        setShowCancleOrderModal(false);
        setSelectedOrderId(null);
    };

    return (
        <div className='relative p-5 sm:p-8 lg:p-[48px] bg-[#D2D2D2] min-h-screen overflow-hidden'>
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage: `url('${backgrounds[activeTab]}')`,
                    opacity: 0.65,
                }}
            />
            <div className='relative z-10'>
                <h1 className="text-xl sm:text-2xl font-medium mb-4 pt-8 sm:pt-10 lg:pt-[48px]">Hello, {name}</h1>

                {/* Таби */}
                <div className="py-3 sm:p-[16px] flex flex-row flex-wrap items-center gap-3 sm:gap-6 overflow-x-auto">
                    {tabs.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex flex-row items-center gap-2 pb-2 border-b-2 whitespace-nowrap text-sm sm:text-base transition-colors ${activeTab === id ? 'border-black' : 'border-transparent'}`}
                        >
                            <span>{label}</span>
                            <img src={icon} alt={label} width={18} height={18} className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            localStorage.removeItem('username');
                            localStorage.removeItem('email');
                            localStorage.removeItem('country');
                            window.location.href = '/loginRegisterUser'
                        }}
                        className="flex flex-row items-center gap-2 pb-2 border-b-2 border-transparent whitespace-nowrap text-sm sm:text-base"
                    >
                        <span>Log out</span>
                        <img src="/images/icons/logoutIcon.png" alt="Log out" className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Контент під табами */}
                <div className="mt-6">
                    {activeTab === 'account' && (
                        <div>
                            <h3 className="font-medium mb-3">Personal information</h3>
                            <div className="field pt-[5px] max-w-[701px]">
                                <input type="email" value={email} readOnly className={inputSmallStyle} />
                            </div>
                            <div className="field pt-4 sm:pt-[25px] max-w-[701px]">
                                <div className="flex items-center gap-2">
                                    <input
                                        type={editingPass ? "text" : "password"}
                                        value={password}
                                        readOnly={!editingPass}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputSmallStyle}
                                    />
                                    <button onClick={() => setEditingPass(!editingPass)} className="shrink-0">
                                        {editingPass ? "✓" : "✏️"}
                                    </button>
                                </div>

                                <div className='pt-8 sm:pt-[48px]'>
                                    <h3>Your default delivery adress (set a default)</h3>
                                    <div className='pt-4 sm:pt-[24px] w-full sm:max-w-[450px] flex flex-col gap-3'>
                                        <div>
                                            <p className="mb-1 text-sm">Country</p>
                                            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputSmallStyle} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm">City</p>
                                            <input onChange={(e) => setPassword(e.target.value)} className={inputSmallStyle} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm">Postcode</p>
                                            <input onChange={(e) => setPassword(e.target.value)} className={inputSmallStyle} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm">Street</p>
                                            <input onChange={(e) => setPassword(e.target.value)} className={inputSmallStyle} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm">House</p>
                                            <input onChange={(e) => setPassword(e.target.value)} className={inputSmallStyle} />
                                        </div>
                                        <div className="flex justify-end mt-3 sm:mt-6">
                                            <button
                                                type="button"
                                                className="bg-[#1A1A1A] text-white text-sm font-medium px-8 sm:px-[100px] py-3 hover:bg-black transition-colors w-full sm:w-auto"
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
                            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                                {/* Ліва колонка — замовлення */}
                                <div className="overflow-y-auto max-h-[500px] lg:max-h-[700px] w-full lg:w-1/2">
                                    {orders && orders.length > 0 ? (
                                        orders.map((o) => (
                                            <div key={o.id}>
                                                <div className='p-2'>
                                                    {o.items?.map((i) => i.productId && cartProducts[i.productId] && (
                                                        <div key={i.productId}>
                                                            <ProductCardForCart p={i} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center'>
                                            <h3 className='text-xl sm:text-3xl'>OOPS, you don't have any orders for now</h3>
                                            <Link
                                                className='bg-black flex justify-center items-center sm:ml-auto text-white text-lg sm:text-2xl w-full sm:w-[350px] h-[44px] shrink-0'
                                                href={'/AllProducts'}
                                            >
                                                Start now
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full lg:w-1/2">
                                    <div className="flex flex-col p-4 sm:p-6"
                                        style={{ background: 'linear-gradient(135deg, #6892A899, #CFAADB80, #E9BDA6E5)' }}
                                    >
                                        <h1 className="text-xl sm:text-3xl mb-4">Shipping form</h1>
                                        <div className="flex flex-col gap-3 text-sm">
                                            <div className='max-h-[100px] sm:max-h-[140px]'>
                                                <img src={"images/userAccount/DeliveryIcon.svg"} className="h-full w-auto" />
                                            </div>
                                            <div>
                                                <h1 className='text-lg sm:text-2xl'>Recipient Information</h1>
                                                {deliveryInfo.firstName && (
                                                    <p>{deliveryInfo.firstName} {deliveryInfo.lastName}</p>
                                                )}
                                                {deliveryInfo.address && (
                                                    <p>{deliveryInfo.address}</p>
                                                )}
                                                {deliveryInfo.country && (
                                                    <p>{deliveryInfo.postalCode} {deliveryInfo.city}, {deliveryInfo.country}</p>
                                                )}
                                                {deliveryInfo.phone && (
                                                    <p><span className="font-medium">Phone:</span> {deliveryInfo.phone}</p>
                                                )}
                                                {!Object.values(deliveryInfo).some(Boolean) && (
                                                    <p className="text-gray-600">No delivery information yet. Fill in the checkout form.</p>
                                                )}
                                            </div>
                                            <div>
                                                <h1 className='text-lg sm:text-2xl'>Customer</h1>
                                                {deliveryInfo.firstName && (
                                                    <p>{deliveryInfo.firstName} {deliveryInfo.lastName}</p>
                                                )}
                                                {deliveryInfo.address && (
                                                    <p>{deliveryInfo.address}</p>
                                                )}
                                                {deliveryInfo.country && (
                                                    <p>{deliveryInfo.postalCode} {deliveryInfo.city}, {deliveryInfo.country}</p>
                                                )}
                                                {deliveryInfo.phone && (
                                                    <p><span className="font-medium">Phone:</span> {deliveryInfo.phone}</p>
                                                )}
                                                {!Object.values(deliveryInfo).some(Boolean) && (
                                                    <p className="text-gray-600">No delivery information yet. Fill in the checkout form.</p>
                                                )}
                                            </div>
                                            <div>
                                                <h1 className='text-lg sm:text-2xl'>Supplier Notes</h1>
                                                {deliveryInfo.comments && (
                                                    <p>{deliveryInfo.comments}</p>
                                                )}
                                                {!Object.values(deliveryInfo).some(Boolean) && (
                                                    <p className="text-gray-600">No delivery information yet. Fill in the checkout form.</p>
                                                )}
                                            </div>
                                        </div>

                                        {firstOrder && (
                                            <button
                                                className='bg-black w-full h-[55px] sm:h-[75px] text-white text-base sm:text-2xl text-center mt-4'
                                                onClick={() => handleInitiateCancel(String(firstOrder.id))}
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        {showCancleOrderModal && (
                                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                                                <div className="bg-[#2a2a2a] p-6 sm:p-10 max-w-lg w-full flex flex-col items-center shadow-xl">
                                                    <h2 className="text-white text-xl sm:text-3xl font-light text-center mb-6 sm:mb-10 tracking-wide">
                                                        Are you sure you want to<br />cancel the order?
                                                    </h2>
                                                    <div className="w-full sm:w-3/4 space-y-4">
                                                        <button
                                                            onClick={handleConfirmCancelOrder}
                                                            className="w-full bg-white text-[#2a2a2a] py-3 text-base sm:text-lg font-normal transition-colors hover:bg-gray-200"
                                                        >
                                                            Yes, cancel
                                                        </button>
                                                        <button
                                                            onClick={handleCloseModal}
                                                            className="w-full bg-[#8a8a8a] text-white py-3 text-base sm:text-lg font-normal transition-colors hover:bg-[#7a7a7a]"
                                                        >
                                                            No, keep order
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <p className="mt-4 text-sm">Order plane on {today}</p>
                                    </div>

                                    <div className='pt-6'>
                                        <span className='text-base sm:text-2xl'>Need help? Email of Call 0(800)313 234</span>
                                    </div>
                                </div>
                            </div>

                            <hr className='mt-6 w-full lg:w-1/2' />

                            <div
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-10 transition-all duration-300 pt-6"
                            >
                                {products.slice(0, 4).map((p) => (
                                    <LargeProductCard key={p.id} p={p} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "contact" && (
                        <div>
                            <div>
                                <h1 className='text-lg sm:text-2xl'>You have any questions? Contact us</h1>
                            </div>
                            <div className='flex flex-col lg:flex-row gap-6 lg:gap-2 pt-2'>
                                <div className='py-4 flex w-full lg:w-1/2 flex-col gap-1'>
                                    <p>Email*</p>
                                    <input type='text' name="email" value={formData.email} onChange={handleChange} className={inputBaseStyle} />
                                    <p className="mt-2">Your name*</p>
                                    <input type='text' name="name" value={formData.Name} onChange={handleChange} className={inputBaseStyle} />
                                    <p className="mt-2">Phone number*</p>
                                    <input type='text' name="phone" value={formData.phone} onChange={handleChange} className={inputBaseStyle} />
                                    <p className="mt-2">Text*</p>
                                    <textarea name="text" value={formData.text} onChange={handleChange} className={inputBaseStyle} rows={4} />
                                    <button
                                        className='bg-black text-white w-full sm:w-1/2 h-[44px] px-4 text-base sm:text-2xl text-center mt-3'
                                        onClick={() => alert("Your email was send")}
                                    >
                                        Send an appear
                                    </button>
                                </div>

                                <div className='px-0 lg:px-4 space-y-2 w-full lg:w-1/2'>
                                    <button
                                        className='bg-black text-white w-full h-[44px] px-4 text-base sm:text-2xl text-center'
                                        onClick={() => alert("Your email was send")}
                                    >
                                        Send an appear
                                    </button>
                                    <div className='py-4'>
                                        <div className='font-semibold text-lg sm:text-2xl flex p-2 items-center gap-2'>
                                            <Phone className="shrink-0" />
                                            <h1 className='font-semibold'>0 (800) 313 234</h1>
                                        </div>
                                        <div className='font-semibold text-lg sm:text-2xl flex p-2 items-center gap-2'>
                                            <Mail className="shrink-0" />
                                            <h1 className='font-semibold'>lyne@gmail.com</h1>
                                        </div>
                                        <div className='pt-4 sm:pt-6 flex'>
                                            <h1 className="text-sm sm:text-base">Through the above channels, you can file a complaint or report incidents or safety issues related to the product to us.</h1>
                                        </div>
                                        <div className='space-y-2 pt-4 sm:pt-6 text-[#00000080] text-sm sm:text-base'>
                                            <h1>Customer service center</h1>
                                            <h1>Monday to Friday 9:00 a.m. to 5:00 p.m.</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
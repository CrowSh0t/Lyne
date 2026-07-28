'use client';
import { useEffect, useState } from 'react';
import { components } from '../api/schema';
import { useLoading } from '../context/LoadingContext';
import { deleteOrder, getOrdersbyUserName, getProduct, getProducts, updateOrderStatus } from '../api/fetchApi/admin';
import Link from 'next/link';
import LargeProductCard from '@/components/LargeProductCard';
import ProductCardForCart from '@/components/ProductCardForCart';
import { Mail, Phone, PhoneCall } from 'lucide-react';

type OrderDto = components["schemas"]["OrderDto"]
type ProductDto = components["schemas"]["ProductDto"]

export default function MyAccountPage() {
    const inputBaseStyle = 'w-full bg-gray-50 rounded-lg px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black transition duration-150';
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
            console.log('Отримані ордери з сервера:', ordersData);
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

    // 2. Function that actually deletes the order (called from the modal)
    const handleConfirmCancelOrder = () => {
        if (selectedOrderId) {
            updateOrderStatus(selectedOrderId,'Cancelled');
            setShowCancleOrderModal(false); // Close modal after deleting
            setSelectedOrderId(null); // Reset ID
            window.location.reload();
        }
    };

    // 3. Function to close modal without deleting
    const handleCloseModal = () => {
        setShowCancleOrderModal(false);
        setSelectedOrderId(null);
    };

    return (
        <div className='p-[48px] bg-[#D2D2D2]'>
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage: `url('${backgrounds[activeTab]}')`,
                    opacity: 0.65,
                }}
            />
            <div className='relative z-10'>
                <h1 className="text-2xl font-medium mb-4 pt-[48px]">Hello, {name}</h1>

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
                            localStorage.removeItems('username','email','country')
                            window.location.href = '/loginRegisterUser'
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
                                    className="input bg-[#F9F9F9] w-[701px] h-[50px] br-[3]"
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
                            <div className="flex flex-row gap-4 items-stretch">
                                {/* Ліва колонка — замовлення */}
                                <div className="overflow-y-auto max-h-[700px] w-1/2">
                                    {orders && orders.length > 0 ? (
                                        orders.map((o) => (
                                            <div key={o.id}>
                                                <div className='p-2'>
                                                    {o.items?.map((i) => i.productId && cartProducts[i.productId] && (
                                                        <div >
                                                            <ProductCardForCart p={i} />
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                            </div>
                                        ))
                                    ) : (
                                        <div className='flex flex-row w-full'>
                                            <h3 className='text-3xl'>OOPS, you don't have any orders for now</h3>
                                            <Link
                                                className='bg-black flex justify-center items-center ml-auto text-white text-2xl w-[350px] h-[44px]'
                                                href={'/AllProducts'}
                                            >
                                                Start now
                                            </Link>
                                        </div>
                                    )}
                                    
                                </div>
                                <div>
                                    <div className=" flex flex-col p-6"
                                        style={{ background: 'linear-gradient(135deg, #6892A899, #CFAADB80, #E9BDA6E5)' }}
                                    >
                                        <h1 className="text-3xl mb-4">Shipping form</h1>
                                        <div className="flex flex-col gap-3 text-sm">
                                            <div className='max-h-[140px]'>
                                                <img src={"images/userAccount/DeliveryIcon.svg"} />
                                            </div>
                                            <div>
                                                <h1 className='text-2xl'>Recipient Information</h1>
                                                {deliveryInfo.firstName && (
                                                    <p><span className="font-medium"></span> {deliveryInfo.firstName} {deliveryInfo.lastName}</p>
                                                )}
                                                {deliveryInfo.address && (
                                                    <p><span className="font-medium"></span> {deliveryInfo.address}</p>
                                                )}
                                                {deliveryInfo.country && (
                                                    <p><span className="font-medium"></span>{deliveryInfo.postalCode} {deliveryInfo.city}, {deliveryInfo.country} </p>
                                                )}
                                                {deliveryInfo.phone && (
                                                    <p><span className="font-medium">Phone:</span> {deliveryInfo.phone}</p>
                                                )}
                                                {!Object.values(deliveryInfo).some(Boolean) && (
                                                    <p className="text-gray-600">No delivery information yet. Fill in the checkout form.</p>
                                                )}
                                            </div>
                                            <div>
                                                <h1 className='text-2xl'>Customer</h1>
                                                {deliveryInfo.firstName && (
                                                    <p><span className="font-medium"></span> {deliveryInfo.firstName} {deliveryInfo.lastName}</p>
                                                )}
                                                {deliveryInfo.address && (
                                                    <p><span className="font-medium"></span> {deliveryInfo.address}</p>
                                                )}
                                                {deliveryInfo.country && (
                                                    <p><span className="font-medium"></span>{deliveryInfo.postalCode} {deliveryInfo.city}, {deliveryInfo.country} </p>
                                                )}
                                                {deliveryInfo.phone && (
                                                    <p><span className="font-medium">Phone:</span> {deliveryInfo.phone}</p>
                                                )}
                                                {!Object.values(deliveryInfo).some(Boolean) && (
                                                    <p className="text-gray-600">No delivery information yet. Fill in the checkout form.</p>
                                                )}
                                            </div>
                                            <div>
                                                <h1 className='text-2xl'>Supplier Notes</h1>
                                                {deliveryInfo.comments && (
                                                    <p><span className="font-medium"></span> {deliveryInfo.comments}</p>
                                                )}
                                                {!Object.values(deliveryInfo).some(Boolean) && (
                                                    <p className="text-gray-600">No delivery information yet. Fill in the checkout form.</p>
                                                )}
                                            </div>
                                        </div>
                                        {firstOrder && (
                                            <button className='bg-black w-full h-[75px] text-white text-2xl text-center'
                                                onClick={() => handleInitiateCancel(String(firstOrder.id))}>Cancel Order</button>
                                        )}
                                        {showCancleOrderModal && (
                                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                                                <div className="bg-[#2a2a2a] p-10 max-w-lg w-full flex flex-col items-center shadow-xl">

                                                    <h2 className="text-white text-3xl font-light text-center mb-10 tracking-wide">
                                                        Are you sure you want to<br />cancel the order?
                                                    </h2>

                                                    <div className="w-3/4 space-y-4">
                                                        <button
                                                            onClick={handleConfirmCancelOrder}
                                                            className="w-full bg-white text-[#2a2a2a] py-3 text-lg font-normal transition-colors hover:bg-gray-200"
                                                        >
                                                            Yes, cancel
                                                        </button>

                                                        <button
                                                            onClick={handleCloseModal}
                                                            className="w-full bg-[#8a8a8a] text-white py-3 text-lg font-normal transition-colors hover:bg-[#7a7a7a]"
                                                        >
                                                            No, keep order
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                        <p>Order plane on {today}</p>

                                    </div>
                                    <div className='pt-6'>
                                        <span className='text-2xl'>Need help? Email of Call 0(800)313 234</span>
                                    </div>
                                </div>
                            </div>
                            <hr className='mt-6 w-1/2' />
                            <div
                                className="grid gap-x-4 gap-y-10 transition-all duration-300 overflow-x-ayto h-1/2 pt-6"
                                style={{ gridTemplateColumns: `repeat(4, minmax(0, 1fr))` }}>
                                {products.slice(0, 4).map((p) => (
                                    <LargeProductCard
                                        key={p.id}
                                        p={p}
                                    />
                                ))
                                }
                            </div>
                        </div>
                    )}
                    {
                        activeTab === "contact" && (
                            <div>
                                <div>
                                    <h1 className='text-2xl'>You have any questions? Contact us</h1>
                                </div>
                                <div className='flex flex-row grab-2'>
                                    <div className='py-4 flex w-1/2 flex-col'>
                                        <p>Email*</p>
                                        <input type='text' name="email" value={formData.email} onChange={handleChange} className={inputBaseStyle}></input>
                                        <p>Your name*</p>
                                        <input type='text' name="name" value={formData.Name} onChange={handleChange} className={inputBaseStyle}></input>
                                        <p>Phone munber*</p>
                                        <input type='text' name="phone" value={formData.phone} onChange={handleChange} className={inputBaseStyle}></input>
                                        <p>Text*</p>
                                        <textarea name="firstName" value={formData.text} onChange={handleChange} className={inputBaseStyle}></textarea>
                                        <button className='bg-black text-white w-1/2 h-[44px] px-4 text-2xl text-center'
                                            onClick={() => alert("Your email was send")}>Send an appear</button>
                                    </div>
                                    <div className='px-4 space-y-2'>
                                        <button className='bg-black text-white w-[401px] h-[44px] px-4 text-2xl text-center '
                                            onClick={() => alert("Your email was send")}>Send an appear
                                        </button>
                                        <div className='py-4'>
                                            <div className='font-semibold text-2xl flex p-2 items-center '>
                                                <Phone />
                                                <h1 className='font-semibold '> 0 (800) 313 234</h1>
                                            </div>
                                            <div className='font-semibold text-2xl flex p-2 items-center'>
                                                <Mail />
                                                <h1 className='font-semibold'>lyne@gmail.com</h1>
                                            </div>
                                            <div className='pt-6 flex'>
                                                <h1>Through the above channels, you can file a complaint or report incidents or safety issues related to the product to us.</h1>
                                            </div>
                                            <div className='space-y-2 pt-6 text-[#00000080]'>
                                                <h1>Customer service center</h1>
                                                <h1>Monday to Friday 9:00 a.m. to 5:00 p.m.</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
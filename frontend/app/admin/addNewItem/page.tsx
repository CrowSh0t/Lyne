'use client'
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAdminHeaderStore } from "@/app/store/adminHeader";

interface ProductDto {
    id: number;
    name: string;
    brandId: number;
    imageUrl?: string[];
    price: number;
    quantity?: number;
    status?: string;
    categoryId?: number;
    code?: string;
    description?: string;
}
interface BrandDto {
    id: number;
    name: string;
}
interface CreateProductDto {
    name: string;
    brandId: number;
    description: string;
    details: string;
    price: number;
    colorId: number;
    sizeId: number;
    composition: string;
    categoriesId: number[];
    matchProductsId: number[];
    imageUrl: string[];
}


export default function addNewItem() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [isMassMarket, setIsMassMarket] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const [isBanner, setIsBanner] = useState(false)
    const [isNewsletter, setIsNewsletter] = useState(false)
    const [formData, setFormData] = useState<CreateProductDto>({
        name: '',
        brandId: 0,
        description: '',
        details: '',
        price: 0,
        colorId: 0,
        sizeId: 0,
        composition: '',
        categoriesId: [],
        matchProductsId: [],
        imageUrl: [],
    })
    const [images, setImages] = useState<(File | null)[]>([null, null, null, null])
    const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null])
    const fileInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
        ]).then(([prods, brnds]: [ProductDto[], BrandDto[]]) => {
            setProducts(prods);
            setBrands(brnds);
        });
    }, []);

    const handleImageClick = (index: number) => {
        fileInputRefs[index].current?.click()
    }

    const handleImageChange = (index: number, file: File | null) => {
        if (!file) return

        const newImages = [...images]
        newImages[index] = file
        setImages(newImages)

        const newPreviews = [...previews]
        newPreviews[index] = URL.createObjectURL(file)
        setPreviews(newPreviews)
    }

    const handleCreate = async () => {
        // // Спочатку завантажуємо фото
        // const uploadedUrls: string[] = []

        // for (const file of images) {
        //     if (!file) continue
        //     const fd = new FormData()
        //     fd.append('file', file)

        //     const res = await fetch('/api/upload', {
        //         method: 'POST',
        //         body: fd,
        //     })
        //     if (res.ok) {
        //         const { url } = await res.json()
        //         uploadedUrls.push(url)
        //     }
        // }

        // // Потім створюємо товар з url фото
        // const res = await fetch('/api/products', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ ...formData, imageUrl: uploadedUrls }),
        // })

        // if (res.ok) {
        //     const newProduct = await res.json()
        //     setProducts(prev => [...prev, newProduct])
        // }
        setShowModal(true);
    }

    // Компонент однієї кнопки-фото
    const PhotoButton = ({ index, size }: { index: number, size: 'large' | 'small' }) => (
        <>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRefs[index]}
                className="hidden"
                onChange={e => handleImageChange(index, e.target.files?.[0] ?? null)}
            />
            <button
                onClick={() => handleImageClick(index)}
                className={`border-none outline-none rounded overflow-hidden relative flex items-center justify-center
                ${size === 'large' ? 'w-full h-[260px]' : 'w-1/3 h-[130px]'}`}
                style={previews[index]
                    ? { backgroundImage: `url(${previews[index]})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { backgroundColor: '#f3f4f6' }
                }
            >
                {!previews[index] && (
                    <Image
                        src={"/images/admin/icons/templateForAddPhotoIcon.png"}
                        alt=""
                        width={size === 'large' ? 248 : 113}
                        height={size === 'large' ? 248 : 112}
                    />
                )}
            </button>
        </>
    )

    // Хелпер для простих полів
    const handleChange = (field: keyof CreateProductDto, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    const setRightContent = useAdminHeaderStore(s => s.setRightContent)

    useEffect(() => {
        setRightContent(
            <>
            </>
        )
    }, [])

    return (
        <div>
            <div className="p-4">
                <Link href={'/admin/main'}>
                    <Image src={'/images/icons/viewAllBtn.png'} alt={''} className='scale-x-[-1] pt-[36px]' width={47} height={34} />
                </Link>
            </div>
            <div className="p-4 flex flex-row">
                <h1 className="text-3xl font-medium">New item</h1>
                {/* div із вибором мас маркет або преміум сегмент */}
                <div className="pl-36 flex">
                    <label className="text-2xl flex items-center gap-2 cursor-pointer px-6">
                        <input type="checkbox" checked={isMassMarket} onChange={e => setIsMassMarket(e.target.checked)} className="hidden" />
                        <div className={`w-5 h-5 ... ${isMassMarket ? 'bg-black/50' : 'bg-gray-200'}`}>
                            {isMassMarket && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>)}
                        </div>
                        Mass Market
                    </label>
                    <label className="text-2xl flex items-center gap-2 cursor-pointer px-6">
                        <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} className="hidden" />
                        <div className={`w-5 h-5 ... ${isPremium ? 'bg-black/50' : 'bg-gray-200'}`}>
                            {isPremium && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>)}
                        </div>
                        Premium segment
                    </label>
                </div>

            </div>
            <div className="flex flex-column grab-2">
                {/* div із заповненням полів */}
                <div className="p-6">
                    <div className="py-2">
                        <h2 className="text-xl">Name of Item</h2>
                        <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                            value={formData.name}
                            onChange={e => handleChange('name', e.target.value)} />
                    </div>

                    <div className="py-2">
                        <h2 className="text-xl">Short Description</h2>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            value={formData.description}
                            onChange={e => handleChange('description', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                            <h2>Brand</h2>
                            <div className="relative flex items-center">
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none"
                                    value={formData.brandId}
                                    onChange={e => handleChange('brandId', Number(e.target.value))}
                                >
                                    <option value={0}>—</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                            </div>
                        </div>
                        <div>
                            <h2>Color</h2>
                            <div className="relative flex items-center">
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none"
                                    value={formData.colorId}
                                    onChange={e => handleChange('colorId', Number(e.target.value))}
                                >
                                    <option value={0}>—</option>
                                </select>
                                <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                            </div>
                        </div>
                        <div>
                            <h2>Quantity</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number" />
                        </div>
                        <div>
                            <h2>Size</h2>
                            <div className="relative flex items-center">
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none"
                                    value={formData.sizeId}
                                    onChange={e => handleChange('sizeId', Number(e.target.value))}
                                >
                                    <option value={0}>—</option>
                                    <option value={1}>XS</option>
                                    <option value={2}>S</option>
                                    <option value={3}>M</option>
                                    <option value={4}>L</option>
                                    <option value={5}>XL</option>
                                </select>
                                <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                            </div>
                        </div>
                        <div>
                            <h2>Code</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded" />
                        </div>
                        <div>
                            <h2>Price</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                value={formData.price}
                                onChange={e => handleChange('price', Number(e.target.value))} />
                        </div>
                    </div>
                    {/* div для знижки */}
                    <div className="p-2">
                        <h1 className="text-2xl font-medium">Add discount %</h1>
                        <h2>Amount of discount, %</h2>
                        <input className="w-[232px] bg-gray-100 border-none outline-none px-3 py-2 rounded" />
                        <div className="flex flex-row grab-2">
                            <div className="p-2 w-[302px]">
                                <h2>Start date</h2>
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none">
                                    <option>1</option>
                                </select>
                            </div>
                            <div className="p-2 w-[302px]">
                                <h2>End date</h2>
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none">
                                    <option>1</option>
                                </select>

                            </div>
                        </div>
                    </div>
                    {/* div для Promote */}
                    <div className="p-2">
                        <h1 className="text-2xl font-medium">Promote the item</h1>
                        <div className="flex flex-row grab-2">
                            <label className="text-2xl flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isNewsletter}
                                    onChange={(e) => setIsNewsletter(e.target.checked)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors
                        ${isNewsletter ? 'bg-black/50' : 'bg-gray-200'}`}
                                >
                                    {isNewsletter && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>
                                Add to the banner
                            </label>
                            <label className="text-2xl flex items-center gap-2 cursor-pointer pl-6">
                                <input
                                    type="checkbox"
                                    checked={isBanner}
                                    onChange={(e) => setIsBanner(e.target.checked)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors
                        ${isBanner ? 'bg-black/50' : 'bg-gray-200'}`}
                                >
                                    {isBanner && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>
                                Add to the newsletter
                            </label>
                        </div>
                    </div>
                </div>
                {/* права частина екрану */}
                <div className="pr-12 pl-4 w-1/2 ml-auto">
                    <div className="py-2">
                        <h2 className="text-xl">Fabric composition</h2>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            value={formData.composition}
                            onChange={e => handleChange('composition', e.target.value)} />
                    </div>
                    <div className="py-2">
                        <h2 className="text-xl">Add photos & video</h2>
                        {/* <button className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-[260px] items-center flex justify-center">
                            <Image src={"/images/admin/icons/templateForAddPhotoIcon.png"} alt={""} width={248} height={248} />
                        </button>
                        <div className="flex flex-row gap-3 pt-6">
                            <button className="w-1/3 bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-[130px] items-center flex justify-center">
                                <Image src={"/images/admin/icons/templateForAddPhotoIcon.png"} alt={""} width={113} height={112} />
                            </button>
                            <button className="w-1/3 bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-[130px] items-center flex justify-center p-2">
                                <Image src={"/images/admin/icons/templateForAddPhotoIcon.png"} alt={""} width={113} height={112} />
                            </button>
                            <button className="w-1/3 bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-[130px] items-center flex justify-center p-2">
                                <Image src={"/images/admin/icons/templateForAddPhotoIcon.png"} alt={""} width={113} height={112} />
                            </button>
                        </div> */}
                        <PhotoButton index={0} size="large" />

                        {/* 3 маленькі */}
                        <div className="flex flex-row gap-3 pt-6">
                            <PhotoButton index={1} size="small" />
                            <PhotoButton index={2} size="small" />
                            <PhotoButton index={3} size="small" />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 p-4">
                        <button className="flex flex-row">
                            <Image src={"/images/admin/icons/uploadFromIcon.png"} alt={""} width={24} height={24} />
                            <label>Upload from your computer</label>
                        </button>
                        <button className="flex ml-auto">
                            <Image src={"/images/admin/icons/addMoreIcon.png"} alt={""} width={119} height={28} />
                        </button>
                    </div>
                    <button className="bg-black flex justify-center items-center py-3 text-white w-full text-2xl mt-auto" onClick={() => handleCreate()}>
                        Add new Item
                    </button>
                    {showModal && (
                        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
                            <div className="bg-[#1A1D23] flex items-center justify-center w-[775px] h-[335px] relative">

                                <button className="absolute top-3 right-3" onClick={() => setShowModal(false)}>
                                    <img src={"/images/admin/icons/closeIcon.png"} />
                                </button>

                                <img src={"/images/admin/ImageForModal.png"} />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg text-white">The item is successfully added to your website</p>
                                    <Link href={"/admin/items"}>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 bg-white"
                                        >
                                            View on the website
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
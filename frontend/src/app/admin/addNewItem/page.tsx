'use client'
import type { components } from "@/src/app/api/schema";
import { useEffect,useState } from "react";
import { useAdminHeaderStore } from "@/src/app/store/adminHeader";
import { getBrands, getCategories, getColors, getProducts, getSizes } from "@/src/app/api/fetchApi/admin";
import { useLoading } from "@/src/app/context/LoadingContext";
import { useRouter } from "next/navigation";
import BackElement from "../../../../components/BackToMainPageElem";
import PhotoButton, { PhotoSlotValue } from "../../../../components/PhotoBtn";
import { createProduct } from "@/src/app/api/fetchApi/admin";

type BrandDto = components["schemas"]["BrandDto"];
type CategoryDto = components["schemas"]["CategoryDto"];
type ColorDto = components["schemas"]["ColorDto"];
type ProductDto = components["schemas"]["ProductDto"];
type SizeDto = components["schemas"]["SizeDto"];

const uploadFileToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    return URL.createObjectURL(file);
};

export default function addNewItem() {
    const router = useRouter();
    const { setLoading } = useLoading();
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [colors, setColors] = useState<ColorDto[]>([]);
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [sizes, setSizes] = useState<SizeDto[]>([]);
    const [isMassMarket, setIsMassMarket] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const [isBanner, setIsBanner] = useState(false)
    const [isNewsletter, setIsNewsletter] = useState(false)

    // Розширюємо тип, щоб підтримувати imageUrl як масив рядків або рядок
    const [formData, setFormData] = useState<Partial<ProductDto> & { imageUrl?: string[], categoriesId?: number[], details?: string }>({
        categoriesId: []
    });
    const [showModal, setShowModal] = useState(false);
    const [photoSlots, setPhotoSlots] = useState<(PhotoSlotValue | undefined)[]>([])

    const capitalizeFirst = (value: string) => {
        if (!value) return value
        return value.charAt(0).toUpperCase() + value.slice(1)
    }

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getColors(),
            getProducts(),
            getBrands(),
            getSizes(),
            getCategories()
        ])
            .then(([colorsData, productsData, brandsData, sizesData, categoryData]) => {
                setColors(colorsData);
                setProducts(productsData);
                setBrands(brandsData);
                setSizes(sizesData);
                setCategories(categoryData);
            })
            .catch((error) => console.error("Error while getting data:", error))
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryChange = (catId: number, isChecked: boolean) => {
        setFormData(prev => {
            const currentIds = prev.categoriesId || [];
            if (isChecked) {
                return { ...prev, categoriesId: [...currentIds, catId] };
            } else {
                return { ...prev, categoriesId: currentIds.filter(id => id !== catId) };
            }
        });
    };
    const handleCreate = async () => {
        setLoading(true);
        try {
            const uploadedUrls: string[] = [];
            for (const slot of photoSlots) {
                if (!slot) continue;
                if (slot.file) {
                    const url = await uploadFileToServer(slot.file);
                    uploadedUrls.push(url);
                } else if (slot.url) {
                    uploadedUrls.push(slot.url);
                }
            }

            const finalCategories = formData.categoriesId && formData.categoriesId.length > 0
                ? formData.categoriesId
                : [1];
            const cleanPayload = {
                // З великої літери (PascalCase)
                Name: formData.name || "Default Name",
                Description: formData.description || "Default Description",
                Details: formData.details || "No details provided",
                ProductCode: formData.productCode || "CODE123",
                Price: formData.price ? Number(formData.price) : 0,
                StockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : 0,
                BrandId: formData.brandId ? Number(formData.brandId) : 0,
                ColorId: formData.colorId ? Number(formData.colorId) : 0,
                SizeId: formData.sizeId ? Number(formData.sizeId) : 0,
                CategoriesId: finalCategories,
                ImageUrl: uploadedUrls,
                IsMassMarket: isMassMarket,
                IsPremium: isPremium,
                IsBanner: isBanner,
                IsNewsletter: isNewsletter,
                Status: "available",
            };

            const created = await createProduct(cleanPayload as any);
            setShowModal(true);

        } catch (error) {
            console.error("Error while item added:", error);
            alert("Сталася помилка при збереженні.");
        } finally {
            setLoading(false);
        }
    }

    const handlePhotoChange = (slotIndex: number, values: PhotoSlotValue[]) => {
        setPhotoSlots(prev => {
            const newSlots = [...prev]
            newSlots[slotIndex] = values[0]
            return newSlots
        })
    }

    const setRightContent = useAdminHeaderStore(s => s.setRightContent)
    useEffect(() => { if (setRightContent) setRightContent(<></>) }, [])

    return (
        <div>
            <BackElement />
            <div className="p-4 flex flex-row">
                <h1 className="text-3xl font-medium">New item</h1>
                <div className="pl-36 flex">
                    <label className="text-2xl flex items-center gap-2 cursor-pointer px-6">
                        <input
                            type="checkbox"
                            checked={isMassMarket}
                            onChange={(e) => setIsMassMarket(e.target.checked)}
                            className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors
                        ${isMassMarket ? 'bg-black/50' : 'bg-gray-200'}`}
                        >
                            {isMassMarket && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </div>
                        Mass Market
                    </label>
                    <label className="text-2xl flex items-center gap-2 cursor-pointer px-6">
                        <input
                            type="checkbox"
                            checked={isPremium}
                            onChange={(e) => setIsPremium(e.target.checked)}
                            className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors
                        ${isPremium ? 'bg-black/50' : 'bg-gray-200'}`}
                        >
                            {isPremium && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </div>
                        Premium segment
                    </label>
                </div>
            </div>

            <div className="flex flex-row gap-2">
                <div className="p-6 w-1/2">
                    <div className="py-2">
                        <h2 className="text-xl">Name of Item</h2>
                        <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                            value={formData.name ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: capitalizeFirst(e.target.value) }))} />
                    </div>

                    <div className="py-2">
                        <h2 className="text-xl">Short Description</h2>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            value={formData.description ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: capitalizeFirst(e.target.value) }))} />
                    </div>
                    <div className="py-2">
                        <h2 className="text-xl">Details</h2>
                        <textarea className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded resize-none h-20"
                            value={formData.details ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, details: capitalizeFirst(e.target.value) }))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                            <h2>Brand</h2>
                            <div className="relative flex items-center">
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none"
                                    value={formData.brandId ?? ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, brandId: Number(e.target.value) }))} >
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
                                    value={formData.colorId ?? ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, colorId: Number(e.target.value) }))} >
                                    <option value={0}>—</option>
                                    {colors.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                            </div>
                        </div>
                        <div>
                            <h2>Quantity</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                value={formData.stockQuantity ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <h2>Size</h2>
                            <div className="relative flex items-center">
                                <select className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded appearance-none"
                                    value={formData.sizeId ?? ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, sizeId: Number(e.target.value) }))} >
                                    <option value={0}>—</option>
                                    {sizes.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 pointer-events-none text-sm">▾</span>
                            </div>
                        </div>
                        <div>
                            <h2>Code</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                value={formData.productCode ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value }))} />
                        </div>
                        <div>
                            <h2>Price</h2>
                            <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded"
                                type="number"
                                value={formData.price ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} />
                        </div>
                        <div className="col-span-2">
                            <h2 className="text-xl mb-2">Categories</h2>
                            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
                                {categories.map(c => {
                                    const isChecked = formData.categoriesId?.includes(c.id || 0) || false;
                                    return (
                                        <label key={c.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-200 rounded transition-colors text-lg">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => handleCategoryChange(c.id || 0, e.target.checked)}
                                                className="hidden"
                                            />
                                            <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors
                        ${isChecked ? 'bg-black/50' : 'bg-white border border-gray-300'}`}
                                            >
                                                {isChecked && (
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </div>
                                            {c.name}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <h1 className="text-2xl font-medium">Add discount %</h1>
                        <h2>Amount of discount, %</h2>
                        <input className="w-[232px] bg-gray-100 border-none outline-none px-3 py-2 rounded" />
                        <div className="flex flex-row gap-2">
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

                    <div className="p-2">
                        <h1 className="text-2xl font-medium">Promote the item</h1>
                        <div className="flex flex-row gap-2">
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

                <div className="pr-12 pl-4 w-1/2">
                    <div className="py-2">
                        <h2 className="text-xl">Add photos & video</h2>
                        <PhotoButton index={0} size="large" imgSrc="/images/admin/icons/templateForAddPhotoIcon.png"
                            onImagesChange={(values) => handlePhotoChange(0, values)} />

                        <div className="flex flex-row gap-3 pt-6">
                            <PhotoButton index={1} size="small" imgSrc="/images/admin/icons/templateForAddPhotoIcon.png"
                                onImagesChange={(values) => handlePhotoChange(1, values)} />
                            <PhotoButton index={2} size="small" imgSrc="/images/admin/icons/templateForAddPhotoIcon.png"
                                onImagesChange={(values) => handlePhotoChange(2, values)} />
                            <PhotoButton index={3} size="small" imgSrc="/images/admin/icons/templateForAddPhotoIcon.png"
                                onImagesChange={(values) => handlePhotoChange(3, values)} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 p-4">
                        <button type="button" className="flex flex-row">
                            <img src={"/images/admin/icons/uploadFromIcon.png"} alt={""} width={24} height={24} />
                            <span className="pl-2">Upload from your computer</span>
                        </button>
                    </div>
                    <button type="button" className="bg-black flex justify-center items-center py-3 text-white w-full text-2xl mt-10" onClick={handleCreate}>
                        Add new Item
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
                    <div className="bg-[#1A1D23] flex items-center justify-center w-[775px] h-[335px] relative">
                        <button className="absolute top-3 right-3" onClick={() => { setShowModal(false); router.push('/admin/items'); }}>
                            <img src={"/images/admin/icons/closeIcon.png"} alt="close" />
                        </button>
                        <img src={"/images/admin/ImageForModal.png"} alt="success" />
                        <div className="flex flex-col gap-2 pl-4">
                            <p className="text-lg text-white">The item is successfully added to your website</p>
                            <button
                                onClick={() => { setShowModal(false); router.push('/admin/items'); }}
                                className="px-4 py-2 bg-white text-black font-medium self-start"
                            >
                                View on the website
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
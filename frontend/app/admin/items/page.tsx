'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
}
interface BrandDto {
    id: number;
    name: string;
}

const DropdownFilter = ({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const current = options.find(o => o.value === value)?.label || label;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border-b border-black pb-1 text-xl font-large min-w-[140px] justify-between"
            >
                {current} <Image src={""} alt={""} />
            </button>
            {open && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 shadow-md z-10 min-w-[160px]">
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className="px-4 py-2 text-xl hover:bg-gray-100 cursor-pointer"
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Items() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [brands, setBrands] = useState<Record<number, string>>({});
    // Фільтри
    const [sortBy, setSortBy] = useState("newest");
    const [priceFilter, setPriceFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        // Fetch продуктів і брендів паралельно
        Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
        ]).then(([prods, brnds]: [ProductDto[], BrandDto[]]) => {
            setProducts(prods);
            // Перетворюємо масив брендів у { id: name }
            const brandMap: Record<number, string> = {};
            brnds.forEach(b => { brandMap[b.id] = b.name; });
            setBrands(brandMap);
        });
    }, []);



    useEffect(() => {
        Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
        ]).then(([prods, brnds]: [ProductDto[], BrandDto[]]) => {
            setProducts(prods);
            const brandMap: Record<number, string> = {};
            brnds.forEach(b => { brandMap[b.id] = b.name; });
            setBrands(brandMap);
        });
    }, []);

    const filtered = [...products]
        .filter(p => {
            if (priceFilter === "premium") return p.price >= 1000;
            if (priceFilter === "mid") return p.price >= 300 && p.price < 1000;
            if (priceFilter === "budget") return p.price < 300;
            return true;
        })
        .filter(p => {
            if (statusFilter === "available") return p.status === "available";
            if (statusFilter === "sold_out") return p.status === "sold out";
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return b.id - a.id;
            if (sortBy === "oldest") return a.id - b.id;
            if (sortBy === "price_asc") return a.price - b.price;
            if (sortBy === "price_desc") return b.price - a.price;
            return 0;
        });

    const handleDelete = async (id: number) => {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            // оновити стан, наприклад прибрати товар зі списку
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };
    return (
        <div className="px-4 py-4">
            <div className="flex  justify-end p-2">
                <div className="bg-black w-[209px] h-[44px] item-center flex justify-center">
                    <Link href={"/admin/addNewItem"} className="text-white text-3xl">Add new item +</Link>
                </div>
                <Image src={"/images/admin/icons/notificationIcon.png"} alt={""} width={38} height={32}/>
            </div>
            <div>
                {/* Фільтри */}
                <div className="flex gap-8 mb-6">
                    <DropdownFilter
                        label="Recently added"
                        value={sortBy}
                        onChange={setSortBy}
                        options={[
                            { value: "newest", label: "Recently added" },
                            { value: "oldest", label: "Oldest first" },
                            { value: "price_asc", label: "Price: low to high" },
                            { value: "price_desc", label: "Price: high to low" },
                        ]}
                    />
                    <DropdownFilter
                        label="Premium"
                        value={priceFilter}
                        onChange={setPriceFilter}
                        options={[
                            { value: "all", label: "All prices" },
                            { value: "premium", label: "Premium (1000$+)" },
                            { value: "mid", label: "Mid (300–999$)" },
                            { value: "budget", label: "Budget (<300$)" },
                        ]}
                    />
                    <DropdownFilter
                        label="Status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: "all", label: "All statuses" },
                            { value: "available", label: "Available" },
                            { value: "sold_out", label: "Sold out" },
                        ]}
                    />
                </div>

                {/* Таблиця */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xl border-b border-gray-200">
                            <th className="pb-3 font-normal">Name of the item</th>
                            <th className="pb-3 font-normal">Brand</th>
                            <th className="pb-3 font-normal">Code</th>
                            <th className="pb-3 font-normal">Price</th>
                            <th className="pb-3 font-normal">Quantity</th>
                            <th className="pb-3 font-normal">Status</th>
                            <th className="pb-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 flex items-center gap-3">
                                    {p.imageUrl?.[0] && (
                                        <img src={p.imageUrl[0]} alt={p.name} className="w-10 h-12 object-cover rounded" />
                                    )}
                                    <span>{p.name}</span>
                                </td>
                                <td className="py-3">{brands[p.brandId] ?? "—"}</td>
                                <td className="py-3 text-gray-400">{p.code ?? "—"}</td>
                                <td className="py-3">{p.price}$</td>
                                <td className="py-3">{p.quantity != null ? `${p.quantity} item` : "—"}</td>
                                <td className="py-3">
                                    <span className={p.status === "available" ? "text-gray-700" : "font-bold"}>
                                        {p.status ?? "—"}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-3 text-gray-400">
                                        <button className="hover:text-black px-2"><Image src={"/images/admin/icons/editItemIcon.png"} alt={""} width={18} height={18}/>
                                        </button>
                                        <button className="hover:text-red-500" onClick={()=>handleDelete(p.id)}><Image src={"/images/admin/icons/deleteItemIcon.png"} alt={""} width={18} height={20}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
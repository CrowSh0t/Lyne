'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLoading } from "@/src/app/context/LoadingContext";
import { useAdminHeaderStore } from "@/src/app/store/adminHeader";
import { components } from "@/src/types/schema";
import { getBrands, getProducts} from "@/src/app/api/fetchApi/admin";
type ProductDto = components["schemas"]["ProductDto"];

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
                {current} <img src={""} alt={""} />
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
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        Promise.all([getProducts(), getBrands()])
            .then(([prods, brnds]) => {
                setProducts(prods);
                const brandMap: Record<number, string> = {};
                brnds.forEach(b => {
                    if (b.id != null) brandMap[b.id] = b.name ?? "—";
                });
                setBrands(brandMap);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = [...products]
    .filter(p => {
        const price = p.price ?? 0;
        if (priceFilter === "premium") return price >= 1000;
        if (priceFilter === "mid") return price >= 300 && price < 1000;
        if (priceFilter === "budget") return price < 300;
        return true;
    })
    .filter(p => {
        if (statusFilter === "available") return p.status === "available";
        if (statusFilter === "sold_out") return p.status === "sold out";
        return true;
    })
    .sort((a, b) => {
        const idA = a.id ?? 0;
        const idB = b.id ?? 0;
        const priceA = a.price ?? 0;
        const priceB = b.price ?? 0;
        if (sortBy === "newest") return idB - idA;
        if (sortBy === "oldest") return idA - idB;
        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        return 0;
    });

    const handleDelete = async (id: number) => {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };
    const setRightContent = useAdminHeaderStore(s => s.setRightContent)

    useEffect(() => {
        setRightContent(
            <>
                <Link href={"/admin/addNewItem"}>
                    <button className="bg-black text-white px-4 py-2">Add new item +</button>
                </Link>
            </>
        )
    }, [])
    return (
        <div className="p-6">
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
                                        <Link href={`/admin/updateItem/${p.id}`}>
                                            <img src={p.imageUrl[0]} alt={p.name || ""} className="w-10 h-12 object-cover rounded" />
                                        </Link>
                                    )}
                                    <span>{p.name}</span>
                                </td>
                                <td className="py-3">{brands[p.brandId || 0] ?? "—"}</td>
                                <td className="py-3 text-gray-400">{p.productCode ?? "—"}</td>
                                <td className="py-3">{p.price}$</td>
                                <td className="py-3">{p.stockQuantity != null ? `${p.stockQuantity} item` : "—"}</td>
                                <td className="py-3">
                                    <span className={p.status === "available" ? "text-gray-700" : "font-bold"}>
                                        {p.status ?? "—"}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-3 text-gray-400">
                                        <Link className="hover:text-black px-2" href={`/admin/updateItem/${p.id}`}><img src={"/images/admin/icons/editIcon.png"} alt={""} width={18} height={18} />
                                        </Link>
                                        <button className="hover:text-red-500" onClick={() => handleDelete(p.id || 0)}><img src={"/images/admin/icons/deleteIcon.png"} alt={""} width={18} height={20} /></button>
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
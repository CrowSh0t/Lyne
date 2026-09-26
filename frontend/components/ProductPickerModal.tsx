"use client";

import { useMemo, useState } from "react";
import { X, Search, Check } from "lucide-react";
import { components } from "@/src/types/schema";

type ProductDto = components["schemas"]["ProductDto"];

export default function ProductPickerModal({
    products,
    selectedIds,
    excludeId,
    onClose,
    onConfirm,
}: {
    products: ProductDto[];
    selectedIds: number[];
    excludeId?: number;
    onClose: () => void;
    onConfirm: (ids: number[]) => void;
}) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Set<number>>(new Set(selectedIds));

    const toggle = (id: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return products
            .filter(p => p.id !== excludeId)
            .filter(p =>
                !q ||
                p.name?.toLowerCase().includes(q) ||
                p.productCode?.toLowerCase().includes(q)
            );
    }, [products, query, excludeId]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-lg flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="text-lg font-medium tracking-wide">
                        Обрати товари, які поєднуються
                    </h2>
                    <button onClick={onClose} aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 pt-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            autoFocus
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Пошук за назвою або кодом..."
                            className="w-full bg-gray-100 border-none outline-none pl-9 pr-3 py-2 rounded"
                        />
                    </div>
                    <p className="text-sm text-gray-400 pt-2">
                        Обрано: {selected.size}
                    </p>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-3">
                    {filtered.length === 0 ? (
                        <p className="text-gray-400 text-center py-10">Нічого не знайдено</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filtered.map(p => {
                                const isSelected = selected.has(p.id ?? -1);
                                return (
                                    <button
                                        type="button"
                                        key={p.id}
                                        onClick={() => toggle(p.id ?? -1)}
                                        className={`relative text-left border rounded overflow-hidden transition-colors
                                        ${isSelected ? "border-black" : "border-gray-200 hover:border-gray-400"}`}
                                    >
                                        <div className="relative w-full aspect-[3/4] bg-gray-100">
                                            <img
                                                src={p.imageUrl?.[0] || ""}
                                                alt={p.name || ""}
                                                className="w-full h-full object-cover"
                                            />
                                            <div
                                                className={`absolute top-2 right-2 w-5 h-5 rounded-sm flex items-center justify-center
                                                ${isSelected ? "bg-black" : "bg-white/80 border border-gray-300"}`}
                                            >
                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <p className="text-sm font-medium truncate">{p.name}</p>
                                            <p className="text-xs text-gray-400 truncate">
                                                #{p.productCode} {p.price ? `· ${p.price}UAH` : ""}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex gap-2 p-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border border-black py-2 text-sm font-medium rounded"
                    >
                        Скасувати
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(Array.from(selected))}
                        className="flex-1 bg-black text-white py-2 text-sm font-medium rounded"
                    >
                        Зберегти вибір
                    </button>
                </div>
            </div>
        </div>
    );
}
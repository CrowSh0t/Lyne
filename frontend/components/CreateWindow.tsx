import { useState, useEffect } from 'react';
import PhotoButton, { PhotoSlotValue } from './PhotoBtn'; // Перевірте правильність шляху

// Типи DTO відповідно до вашого опису
export interface CreateSizeDto {
    name?: string | null;
}

export interface CreateColorDto {
    name?: string | null;
    hexCode?: string | null;
}

export interface CreateCategoryDto {
    name?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    parentCategoryId?: number | null;
    type?: string | null;
    productsId?: number[] | null;
}

export interface CreateBrandDto {
    name: string | null;
    description?: string | null;
    logoUrl?: string | null;
}

export type CreateEntityDto = CreateSizeDto | CreateColorDto | CreateCategoryDto | CreateBrandDto;

interface UniversalCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Оновлена функція, яка повертає об'єкт DTO
    onConfirm: (data: CreateEntityDto) => void;
    // Тип елемента, який створюємо
    elementType: 'categories' | 'sizes' | 'colors' | 'brands' | string;
    // Список категорій для вибору батьківської категорії (для Category)
    categoriesList?: { id: number; name: string }[];
}

export default function UniversalCreateModal({
    isOpen,
    onClose,
    onConfirm,
    elementType,
    categoriesList = []
}: UniversalCreateModalProps) {
    // Базові поля
    const [name, setName] = useState('');
    
    // Поля для Color
    const [hexCode, setHexCode] = useState('#000000');

    // Поля для Category / Brand
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
    const [categoryType, setCategoryType] = useState('');

    // Очищення форми при відкритті
    useEffect(() => {
        if (isOpen) {
            setName('');
            setHexCode('#000000');
            setDescription('');
            setImageUrl('');
            setParentCategoryId(null);
            setCategoryType('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Обробка збереження зображення з PhotoButton
    const handleImageChange = (values: PhotoSlotValue[]) => {
        const slot = values[0];
        if (slot) {
            // Якщо є готове URL (наприклад, з інпуту URL) або файл
            if (slot.url) {
                setImageUrl(slot.url);
            } else if (slot.file) {
                // Тимчасовий blob URL. На бекенді потрібно буде завантажити File через FormData
                setImageUrl(URL.createObjectURL(slot.file));
            }
        }
    };

    const handleSubmit = () => {
        if (!name.trim()) return;

        // Формуємо відповідний DTO залежно від elementType
        switch (elementType.toLowerCase()) {
            case 'sizes':
            case 'size': {
                const dto: CreateSizeDto = { name: name.trim() };
                onConfirm(dto);
                break;
            }
            case 'colors':
            case 'color': {
                const dto: CreateColorDto = { 
                    name: name.trim(), 
                    hexCode: hexCode.trim() 
                };
                onConfirm(dto);
                break;
            }
            case 'brands':
            case 'brand': {
                const dto: CreateBrandDto = {
                    name: name.trim(),
                    description: description.trim() || null,
                    logoUrl: imageUrl || null
                };
                onConfirm(dto);
                break;
            }
            case 'categories':
            case 'category': {
                const dto: CreateCategoryDto = {
                    name: name.trim(),
                    description: description.trim() || null,
                    imageUrl: imageUrl || null,
                    parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null,
                    type: categoryType.trim() || null,
                    productsId: []
                };
                onConfirm(dto);
                break;
            }
            default: {
                onConfirm({ name: name.trim() });
                break;
            }
        }

        onClose();
    };

    const normalizedType = elementType.toLowerCase();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#262626] text-white w-full max-w-md p-8 rounded-lg relative shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
                
                {/* Хрестик закриття */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Заголовок */}
                <h2 className="text-2xl font-light mb-6 tracking-wide capitalize">
                    Create <span className="text-gray-400">{elementType}</span>
                </h2>

                <div className="space-y-4">
                    {/* Поле обов'язкової Назви (Name) для всіх типиів */}
                    <div>
                        <label className="block text-sm font-light text-gray-300 mb-1.5 tracking-wide">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`Enter ${elementType} name...`}
                            className="w-full bg-[#fcfcfc] text-black px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm placeholder:text-gray-400"
                        />
                    </div>

                    {/* Поля для COLOR */}
                    {(normalizedType === 'colors' || normalizedType === 'color') && (
                        <div>
                            <label className="block text-sm font-light text-gray-300 mb-1.5 tracking-wide">
                                Color Code (HEX)
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={hexCode}
                                    onChange={(e) => setHexCode(e.target.value)}
                                    className="h-9 w-12 bg-transparent cursor-pointer rounded border border-gray-600"
                                />
                                <input
                                    type="text"
                                    value={hexCode}
                                    onChange={(e) => setHexCode(e.target.value)}
                                    placeholder="#000000"
                                    className="flex-1 bg-[#fcfcfc] text-black px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* Поля для BRAND або CATEGORY (Опис та Зображення) */}
                    {(normalizedType === 'categories' || normalizedType === 'category' || normalizedType === 'brands' || normalizedType === 'brand') && (
                        <>
                            <div>
                                <label className="block text-sm font-light text-gray-300 mb-1.5 tracking-wide">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description..."
                                    rows={3}
                                    className="w-full bg-[#fcfcfc] text-black px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-light text-gray-300 mb-1.5 tracking-wide">
                                    Photo / Logo
                                </label>
                                <PhotoButton
                                    index={0}
                                    size="small"
                                    imgSrc="/placeholder.png" // Вкажіть фонову дефолтну іконку
                                    onImagesChange={handleImageChange}
                                />
                            </div>
                        </>
                    )}

                    {/* Додаткові поля суто для CATEGORY */}
                    {(normalizedType === 'categories' || normalizedType === 'category') && (
                        <>
                            <div>
                                <label className="block text-sm font-light text-gray-300 mb-1.5 tracking-wide">
                                    Category Type
                                </label>
                                <input
                                    type="text"
                                    value={categoryType}
                                    onChange={(e) => setCategoryType(e.target.value)}
                                    placeholder="e.g. clothing, footwear..."
                                    className="w-full bg-[#fcfcfc] text-black px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm placeholder:text-gray-400"
                                />
                            </div>

                            {categoriesList.length > 0 && (
                                <div>
                                    <label className="block text-sm font-light text-gray-300 mb-1.5 tracking-wide">
                                        Parent Category
                                    </label>
                                    <select
                                        value={parentCategoryId ?? ''}
                                        onChange={(e) => setParentCategoryId(e.target.value ? Number(e.target.value) : null)}
                                        className="w-full bg-[#fcfcfc] text-black px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                                    >
                                        <option value="">None (Top Level)</option>
                                        {categoriesList.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {/* Кнопка підтвердження */}
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="w-full bg-white text-black font-normal py-2.5 rounded-sm hover:bg-gray-100 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors tracking-wide text-center mt-4"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
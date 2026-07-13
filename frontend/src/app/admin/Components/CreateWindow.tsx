import React, { useState, useEffect } from 'react';

interface UniversalCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Функція, яка приймає назву (string) і створює елемент
    onConfirm: (name: string) => void; 
    // Назва того, що ми створюємо (напр., "category", "size", "brand")
    elementType: 'categories' | 'sizes' | 'brands' | string; 
}

export default function UniversalCreateModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    elementType 
}: UniversalCreateModalProps) {
    const [inputValue, setInputValue] = useState('');

    // Очищаємо інпут при кожному відкритті модалки
    useEffect(() => {
        if (isOpen) setInputValue('');
    }, [isOpen]);

    if (!isOpen) return null;

    // Форматуємо назву для гарного відображення (напр., "category" -> "Category")
    const formattedType = elementType.charAt(0).toUpperCase() + elementType.slice(1);

    const handleSubmit = () => {
        if (!inputValue.trim()) return; // Перевірка на порожній рядок
        onConfirm(inputValue);
        onClose(); // Закриваємо модалку після підтвердження
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#262626] text-white w-full max-w-md p-8 rounded-lg relative shadow-2xl mx-4">
                
                {/* Хрестик закриття */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Динамічний заголовок, наприклад: Create category */}
                <h2 className="text-2xl font-light mb-6 tracking-wide">
                    Create <span className="text-gray-400">{elementType}</span>
                </h2>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                            Name of {elementType} item
                        </label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={`Enter ${elementType} name...`}
                            className="w-full bg-[#fcfcfc] text-black px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-base placeholder:text-gray-400"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!inputValue.trim()}
                        className="w-full bg-white text-black font-normal py-2.5 rounded-sm hover:bg-gray-100 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors tracking-wide text-center mt-2"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
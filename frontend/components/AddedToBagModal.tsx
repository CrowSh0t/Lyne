"use client";

import { X } from "lucide-react";
import { components } from "@/src/types/schema";

type CartItem = components["schemas"]["CartItem"];

export default function AddedToBagModal({
  items,
  onClose,
}: {
  items: CartItem[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:w-[400px] sm:rounded-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-sm font-medium tracking-wide">
            ADDED TO SHOPPING BAG
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 px-5 py-4">
              <img
                src={item.product?.imageUrl?.[0] || ''}
                alt={item.product?.name || ''}
                className="w-20 h-24 object-cover bg-[#F5F5F3] shrink-0"
              />
              <div className="text-sm">
                <p className="font-medium">{item.product?.name}</p>
                <p className="font-medium mt-1">
                  {item.product?.price?.toLocaleString('uk-UA')} UAH
                </p>
                <p className="text-gray-400 mt-2">#{item.product?.productCode}</p>
                <p className="text-gray-400">Items: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-2 border-t">
          <button
            onClick={() => (window.location.href = "/payment")}
            className="w-full bg-black text-white rounded-full py-3 text-sm font-medium"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => (window.location.href = "/cart")}
            className="w-full border border-black rounded-full py-3 text-sm font-medium"
          >
            View Shopping Bag
          </button>
        </div>
      </div>
    </div>
  );
}
import { ProductDto } from "@/app/types/dto";
import Image from "next/image";

// Картка товару
export default function ProductCard({ product, brandName }: { product: ProductDto; brandName: string }) {
  return (
    <div className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition-all w-[220px]">
      <div className="mb-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-700">
          {brandName}
        </span>
      </div>
      <div className="bg-gray-100 rounded-lg flex items-center justify-center h-48 mb-3">
        {product.imageUrl?.[0] ? (
          <img src={product.imageUrl[0]} alt={product.name} width={150} height={150} className="object-contain" />
        ) : (
          <div className="w-[150px] h-[150px] bg-gray-200 rounded" />
        )}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-800">{product.name}</p>
    </div>
  );
}
import { components } from "@/src/types/schema";

type ProductDto = components["schemas"]["ProductDto"]

export default function SmallProductCard({ product, brandName }: { product: ProductDto; brandName: string }) {
  return (
    <div className="bg-white rounded-xl p-2 sm:p-3 cursor-pointer hover:shadow-md transition-all w-[150px] sm:w-[220px] shrink-0">
      <div className="mb-2">
        <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-gray-700">
          {brandName}
        </span>
      </div>
      <div className="bg-gray-100 rounded-lg flex items-center justify-center h-32 sm:h-48 mb-2 sm:mb-3">
        {product.imageUrl?.[0] ? (
          <img src={product.imageUrl[0]} className="max-w-[100px] sm:max-w-[150px] max-h-[100px] sm:max-h-[150px] object-contain" />
        ) : (
          <div className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] bg-gray-200 rounded" />
        )}
      </div>
      <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-gray-800">{product.name}</p>
    </div>
  );
}
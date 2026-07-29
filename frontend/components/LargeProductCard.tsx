import { components } from "@/src/types/schema";
import Link from "next/link";

type ProductDto = components["schemas"]["ProductDto"]

export default function LargeProductCard({p}:{p:ProductDto}){
    return (
        <Link
            key={p.id}
            className="flex flex-col items-center group relative cursor-pointer"
            href={`/product/${p.id}`}
        >
            <div className='w-full aspect-[3/4] relative bg-[#f5f5f5] mb-3 overflow-hidden'>
                <img
                    src={p.imageUrl?.[0] || '/images/placeholder.png'}
                    alt={p.name || 'Product image'}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <button className='p-1 w-[31px] h-[31px]'>
                        <img
                            src='/images/icons/favoriteIcon.png'
                            alt='Favorite'
                            className=' object-contain opacity-50 hover:opacity-80 transition-opacity'
                        />
                    </button>

                    <button className='p-1 w-[31px] h-[31px]'>
                        <img
                            src='/images/icons/whiteBagIcon.png'
                            alt='Cart'
                            className=' object-contain opacity-50 hover:opacity-80 transition-opacity invert'
                        />
                    </button>
                </div>
            </div>
            <h3 className="text-center text-xs sm:text-sm font-light text-gray-800 uppercase tracking-tight max-w-[90%] line-clamp-1">
                {p.name}
            </h3>
            <p className='font-normal text-gray-900 mt-1'>
                {p.price} UAH
            </p>
        </Link>
    )
}
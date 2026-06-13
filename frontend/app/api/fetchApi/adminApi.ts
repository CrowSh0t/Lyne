import { BrandDto, CategoryDto, ProductDto } from "@/app/types/dto"

// api/adminApi.ts
export const getProducts = async (): Promise<ProductDto[]> => {
    const res = await fetch('/api/products')
    return res.json()
}

export const getBrands = async (): Promise<BrandDto[]> => {
    const res = await fetch('/api/brands')
    return res.json()
}

export const createProduct = async (data: ProductDto): Promise<ProductDto> => {
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return res.json()
}

export const getCategories = async(): Promise<CategoryDto[]> =>{
    const res = await fetch('/api/categories')
    return res.json()
}
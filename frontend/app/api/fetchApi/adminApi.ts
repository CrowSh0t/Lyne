import { BrandDto, CategoryDto, ColorDto, ProductDto, SizeDto } from "@/app/types/dto"

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Сервер повернув помилку ${res.status}: ${errorText || res.statusText}`);
    }
    return res.json();
}


export const getProducts = async (): Promise<ProductDto[]> => {
    const res = await fetch('/api/products');
    return handleResponse(res);
}

export const getProduct = async (id: string): Promise<ProductDto> => {
    const res = await fetch(`/api/products/${id}`);
    return handleResponse(res);
}

export const getBrands = async (): Promise<BrandDto[]> => {
    const res = await fetch('/api/brands');
    return handleResponse(res);
}

export const createProduct = async (data: ProductDto): Promise<ProductDto> => {
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const getCategories = async (): Promise<CategoryDto[]> => {
    const res = await fetch('/api/categories');
    return handleResponse(res);
}

export const getColors = async (): Promise<ColorDto[]> => {
     const res = await fetch('/api/colors');
     return handleResponse(res);
}

export const getSizes = async (): Promise<SizeDto[]> => {
     const res = await fetch('/api/sizes');
     return handleResponse(res);
}
export interface ProductDto {
    id: number;
    name: string;
    brandId: number;
    imageUrl?: string[];
    price: number;
    quantity?: number;
    status?: string;
    categoryId?: number;
    code?: string;
    description?: string;
    details?: string;
    sizeId?: number;
    colorId?: number;
    matchProductsId?: number[];
}

export interface BrandDto {
    id: number;
    name: string;
}

export interface CategoryDto{
    id: number;
    name: string;
    descripton: string;
    producsId: number[];
}
export interface ProductDto {
    id: number;
    name: string;
    brandId: number;
    imageUrl?: string[];
    price: number;
    stockQuantity?: number;
    status?: string;
    categoriesId?: number[];
    productCode?: string;
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
    imageUrl: string;
    parentCategoryId: 0;
    type: string;
    producsId: number[];
}

export interface ColorDto{
    id: number;
    name: string;
    hexCode: string;
}

export interface SizeDto{
    id: number;
    name: string;
}
import { components } from "../schema";

type ProductDto = components["schemas"]["ProductDto"];
type CategoryDto = components["schemas"]["CategoryDto"];
type BrandDto = components["schemas"]["BrandDto"];
type ColorDto = components["schemas"]["ColorDto"];
type SizeDto = components["schemas"]["SizeDto"];
type OrderDto = components["schemas"]["OrderDto"];
type DiscountDto = components["schemas"]["DiscountDto"];
type UserDto = components["schemas"]["UserDto"];

type CreateProductDto = components["schemas"]["CreateProductDto"];
type UpdateProductDto = components["schemas"]["UpdateProductDto"];
type CreateCategoryDto = components["schemas"]["CreateCategoryDto"];
type UpdateCategoryDto = components["schemas"]["UpdateCategoryDto"];
type CreateBrandDto = components["schemas"]["CreateBrandDto"];
type UpdateBrandDto = components["schemas"]["UpdateBrandDto"];
type CreateColorDto = components["schemas"]["CreateColorDto"];
type CreateSizeDto = components["schemas"]["CreateSizeDto"];
type CreateDiscountDto = components["schemas"]["CreateDiscountDto"];


const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Сервер повернув помилку ${res.status}: ${errorText || res.statusText}`);
    }
    if (res.status === 204) return null;
    return res.json();
}

// ---------- Products ----------


export const getProducts = async (): Promise<ProductDto[]> => {
    const res = await fetch('/api/products');
    return handleResponse(res);
}

export const getProduct = async (id: string): Promise<ProductDto> => {
    const res = await fetch(`/api/products/${id}`);
    return handleResponse(res);
}

export const createProduct = async (data: CreateProductDto): Promise<ProductDto> => {
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const updateProduct = async (id: string, data: UpdateProductDto): Promise<ProductDto> => {
    const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const deleteProduct = async (id: string): Promise<void> => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити продукт: ${res.status}`);
}

// ---------- Categories ----------

export const getCategories = async (): Promise<CategoryDto[]> => {
    const res = await fetch('/api/categories');
    return handleResponse(res);
}

export const getCategory = async (id: string): Promise<CategoryDto> => {
    const res = await fetch(`/api/categories/${id}`);
    return handleResponse(res);
}

export const createCategory = async (data: CreateCategoryDto): Promise<CategoryDto> => {
    const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<CategoryDto> => {
    const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const deleteCategory = async (id: string): Promise<void> => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити категорію: ${res.status}`);
}

// ---------- Brands ----------

export const getBrands = async (): Promise<BrandDto[]> => {
    const res = await fetch('/api/brands');
    return handleResponse(res);
}

export const getBrand = async (id: string): Promise<BrandDto> => {
    const res = await fetch(`/api/brands/${id}`);
    return handleResponse(res);
}

export const createBrand = async (data: CreateBrandDto): Promise<BrandDto> => {
    const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const updateBrand = async (id: string, data: UpdateBrandDto): Promise<BrandDto> => {
    const res = await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const deleteBrand = async (id: string): Promise<void> => {
    const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити бренд: ${res.status}`);
}

// ---------- Colors ----------

export const getColors = async (): Promise<ColorDto[]> => {
    const res = await fetch('/api/colors');
    return handleResponse(res);
}

export const createColor = async (data: CreateColorDto): Promise<ColorDto> => {
    const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const deleteColor = async (id: string): Promise<void> => {
    const res = await fetch(`/api/colors/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити колір: ${res.status}`);
}

// ---------- Sizes ----------

export const getSizes = async (): Promise<SizeDto[]> => {
    const res = await fetch('/api/sizes');
    return handleResponse(res);
}

export const createSize = async (data: CreateSizeDto): Promise<SizeDto> => {
    const res = await fetch('/api/sizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const deleteSize = async (id: string): Promise<void> => {
    const res = await fetch(`/api/sizes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити розмір: ${res.status}`);
}

// ---------- Orders (Admin) ----------

export const getOrders = async (): Promise<OrderDto[]> => {
    const res = await fetch('/api/admin/orders');
    return handleResponse(res);
}

export const updateOrderStatus = async (id: string, status: string): Promise<void> => {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status),
    });
    if (!res.ok) throw new Error(`Не вдалося оновити статус замовлення: ${res.status}`);
}

export const updateOrderPayment = async (id: string, paymentStatus: string): Promise<void> => {
    const res = await fetch(`/api/admin/orders/${id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentStatus),
    });
    if (!res.ok) throw new Error(`Не вдалося оновити статус оплати: ${res.status}`);
}

export const deleteOrder = async (id: string): Promise<void> => {
    const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити замовлення: ${res.status}`);
}

// ---------- Discounts (Admin) ----------

export const getDiscounts = async (): Promise<DiscountDto[]> => {
    const res = await fetch('/api/admin/discounts');
    return handleResponse(res);
}

export const createDiscount = async (data: CreateDiscountDto): Promise<DiscountDto> => {
    const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const deleteDiscount = async (id: string): Promise<void> => {
    const res = await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити знижку: ${res.status}`);
}

// ---------- Users (Admin) ----------

export const getUsers = async (): Promise<UserDto[]> => {
    const res = await fetch('/api/admin/users');
    return handleResponse(res);
}

export const getUser = async (id: string): Promise<UserDto> => {
    const res = await fetch(`/api/users/${id}`);
    return handleResponse(res);
}

export const updateUser = async (id: string, status: string): Promise<void> => {
    const res = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status),
    });
    if (!res.ok) throw new Error(`Не вдалося оновити статус замовлення: ${res.status}`);
}

export const deleteUser = async (id: string): Promise<void> => {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Не вдалося видалити замовлення: ${res.status}`);
}


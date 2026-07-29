import { components } from "@/src/types/schema";

type ProductDto = components["schemas"]["ProductDto"];
type CategoryDto = components["schemas"]["CategoryDto"];
type BrandDto = components["schemas"]["BrandDto"];
type ColorDto = components["schemas"]["ColorDto"];
type SizeDto = components["schemas"]["SizeDto"];
type OrderDto = components["schemas"]["OrderDto"];
type DiscountDto = components["schemas"]["DiscountDto"];
type UserDto = components["schemas"]["UserDto"];
type CartItem = components["schemas"]["CartItem"]
type UserFavoriteDto = components["schemas"]["UserFavoriteDto"]

type CreateProductDto = components["schemas"]["CreateProductDto"];
type UpdateProductDto = components["schemas"]["UpdateProductDto"];
type CreateCategoryDto = components["schemas"]["CreateCategoryDto"];
type UpdateCategoryDto = components["schemas"]["UpdateCategoryDto"];
type CreateBrandDto = components["schemas"]["CreateBrandDto"];
type UpdateBrandDto = components["schemas"]["UpdateBrandDto"];
type CreateColorDto = components["schemas"]["CreateColorDto"];
type CreateSizeDto = components["schemas"]["CreateSizeDto"];
type CreateDiscountDto = components["schemas"]["CreateDiscountDto"];
type CreateOrderDto = components["schemas"]["CreateOrderDto"]



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

export const getProductByName = async (name: string): Promise<ProductDto[]> => {
    const res = await fetch(`/api/products/stats/${name}`);
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

export const setFavorite = async (id: string, isFavorite: boolean): Promise<ProductDto> => {
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/products/set-favorite/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
         },
        body: JSON.stringify(isFavorite),
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
    const token = localStorage.getItem("token");
    const res = await fetch('/api/admin/orders', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return handleResponse(res);
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
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    },);
    return handleResponse(res);
}

// ----- Orders (User)-----

export const getOrdersbyUserName = async (userName: string) => {

    console.log("userName =", userName);
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/orders/by-username/${userName}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    })
    return handleResponse(res);
}

export const getUserOrdersById = async (id: string,): Promise<void> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/orders/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(res);
}

export const createUserOrder = async (data: CreateOrderDto): Promise<OrderDto> => {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export const updateOrderStatus = async (id: string, status: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(status)
        
    });
    if (!res.ok) throw new Error(`Не вдалося оновити статус: ${res.status}`);
};

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
    const token = localStorage.getItem("token");
    const res = await fetch('/api/admin/users',{
        method:'GET',
        headers: {Authorization: `Bearer ${token}`}}
    );
    return handleResponse(res);
}

export const getUser = async (id: string): Promise<UserDto> => {
    const res = await fetch(`/api/users/${id}`);
    return handleResponse(res);
}

export const getUserByUserName = async (userName: string): Promise<UserDto> => {
    const res = await fetch(`/api/users/userName/${userName}`);
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

// ---------- Cart ----------

export const getCartItems = async (): Promise<CartItem[]> => {
    const token = localStorage.getItem("token");

    const res = await fetch('/api/cart', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(res);
};


export const deleteCart = async (): Promise<void> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/cart/clear`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },);
    if (!res.ok) throw new Error(`Не вдалося видалити кошик: ${res.status}`);
}

export const deleteCartItem = async (cartItemId:string): Promise<void> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/cart/${cartItemId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },);
    if (!res.ok) throw new Error(`Не вдалося видалити кошик: ${res.status}`);
}


// ------ LOGIN & REGISTER -----

export const Login = async (email: string, password: string): Promise<void> => {

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || data.error || `Сервер повернув помилку ${res.status}`);
    }

    // ⚠️ уточніть точну назву поля — token / accessToken / jwt тощо
    const token = data.token || data.accessToken || data.jwt;
    if (token) {
        localStorage.setItem('token', token);
    } else {
        console.warn('Login response has no token field:', data);
    }

    const meRes = await fetch('/api/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!meRes.ok) {
        console.warn('/api/me returned', meRes.status);
        return;
    }

    const meData = await meRes.json();
    localStorage.setItem('username', meData.name || '');
    localStorage.setItem('email', meData.email || '');
    localStorage.setItem('country', meData.country || '');
    window.dispatchEvent(new Event('authChange'));

    if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', String(Date.now() + 24 * 60 * 60 * 1000));
    }
};

export const Register = async (
    login: string,
    password: string,
    name: string,
    email: string,
    country: string,
    dob: string
): Promise<{ ok: boolean; message?: string }> => {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ login, password, name, email, country, dob }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        return { ok: false, message: extractErrorMessage(data, res.status) };
    }

    const meRes = await fetch('/api/me', { credentials: 'include' });
    if (!meRes.ok) {
        // реєстрація пройшла, але сесія не встановилась — просто повертаємось без даних юзера
        return { ok: true };
    }

    const meData = await meRes.json().catch(() => null);
    if (meData) {
        localStorage.setItem('username', meData.name || '');
        localStorage.setItem('email', meData.email || '');
        localStorage.setItem('country', meData.country || '');
        window.dispatchEvent(new Event('authChange'));
    }

    return { ok: true };
};

function extractErrorMessage(data: any, status: number): string {
    // бекенд може повертати помилку по-різному — пробуємо найпоширеніші варіанти
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        return data.errors.map((e: any) => e.message || e).join(', ');
    }

    if (status === 400) return 'Перевірте правильність введених даних.';
    if (status === 409) return 'Користувач з таким логіном або email вже існує.';
    if (status === 422) return 'Пароль занадто короткий або не відповідає вимогам (мінімум 8 символів, літери та цифри).';

    return 'Помилка реєстрації. Спробуйте ще раз.';
}

// ---- Me---
export const getMe = async (): Promise<CartItem[]> => {
    const token = localStorage.getItem("token");

    const res = await fetch('/api/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(res);
};

// ---- Favorites ---

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getUserFavorites = async (): Promise<UserFavoriteDto[]> => {
    const res = await fetch('/api/favorites', { headers: getAuthHeaders() });
    return handleResponse(res);
}

export const checkIsFavorite = async (productId: number): Promise<boolean> => {
    const res = await fetch(`/api/favorites/${productId}/check`, { headers: getAuthHeaders() });
    return handleResponse(res);
}

export const addToFavorites = async (productId: number): Promise<UserFavoriteDto> => {
    const res = await fetch(`/api/favorites/${productId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
}

export const removeFromFavorites = async (productId: number): Promise<void> => {
    await fetch(`/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
}
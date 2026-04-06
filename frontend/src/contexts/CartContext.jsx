import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'medcare_cart';

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

/**
 * CartProvider - Cung cấp giỏ hàng toàn cục sử dụng Context API với localStorage
 * 
 * Cart item structure:
 * {
 *   drug_id: number,
 *   batch_id: number,
 *   drug_name: string,
 *   batch_number: string,
 *   quantity: number,
 *   price_at_time: number,
 *   subtotal: number,
 *   available_quantity: number
 * }
 */
export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load cart from localStorage khi component mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                setCart(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error('Lỗi load cart từ localStorage:', error);
            setCart([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sync cart to localStorage mỗi khi thay đổi
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, isLoading]);

    /**
     * Thêm thuốc vào giỏ hàng
     */
    const addToCart = useCallback((medicine, batch, quantity = 1) => {
        if (!batch || batch.available_quantity <= 0) {
            throw new Error('Thuốc này hết hàng');
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find(
                item => item.drug_id === medicine.id && item.batch_id === batch.id
            );

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > batch.available_quantity) {
                    throw new Error(`Chỉ còn ${batch.available_quantity} viên`);
                }
                return prevCart.map((item) =>
                    item.drug_id === medicine.id && item.batch_id === batch.id
                        ? {
                            ...item,
                            quantity: newQuantity,
                            subtotal: newQuantity * item.price_at_time
                        }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    drug_id: medicine.id,
                    batch_id: batch.id,
                    drug_name: medicine.name,
                    batch_number: batch.batch_number,
                    quantity,
                    price_at_time: batch.price,
                    subtotal: quantity * batch.price,
                    available_quantity: batch.available_quantity
                }
            ];
        });
    }, []);

    /**
     * Xóa một item khỏi giỏ hàng
     */
    const removeFromCart = useCallback((drugId, batchId) => {
        setCart((prevCart) =>
            prevCart.filter(
                item => !(item.drug_id === drugId && item.batch_id === batchId)
            )
        );
    }, []);

    /**
     * Cập nhật số lượng của một item
     */
    const updateQuantity = useCallback((drugId, batchId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(drugId, batchId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.drug_id === drugId && item.batch_id === batchId) {
                    if (quantity > item.available_quantity) {
                        throw new Error(`Chỉ còn ${item.available_quantity} viên`);
                    }
                    return {
                        ...item,
                        quantity,
                        subtotal: quantity * item.price_at_time
                    };
                }
                return item;
            })
        );
    }, [removeFromCart]);

    /**
     * Xóa sạch giỏ hàng
     */
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    /**
     * Tính tổng số lượng
     */
    const getTotalQuantity = useCallback(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    /**
     * Tính tổng tiền (không bao gồm phí vận chuyển)
     */
    const getSubtotal = useCallback(() => {
        return cart.reduce((sum, item) => sum + item.subtotal, 0);
    }, [cart]);

    /**
     * Tính tổng tiền cuối cùng (bao gồm phí vận chuyển)
     */
    const getTotal = useCallback((shippingFee = 30000) => {
        return getSubtotal() + shippingFee;
    }, [getSubtotal]);

    const value = {
        // State
        cart,
        isLoading,

        // Methods
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        // Computed values
        totalQuantity: getTotalQuantity(),
        subtotal: getSubtotal(),
        getTotal,

        // Helpers
        isEmpty: cart.length === 0
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

/**
 * Hook để sử dụng Cart Context
 */
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart phải được sử dụng trong CartProvider');
    }
    return context;
}

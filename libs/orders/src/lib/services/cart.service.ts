import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart';
import { BehaviorSubject } from 'rxjs';

export const CART_KEY = 'cart';
@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

    initCartLocalStorage() {
        const cart: Cart | null = this.getCart();
        if (!cart) {
            const initialCart = {
                items: []
            };
            const initialCartJson = JSON.stringify(initialCart);
            localStorage.setItem(CART_KEY, initialCartJson);
        }
    }
    emptyCartLocalStorage() {
        const initialCart = {
            items: []
        };
        const initialCartJson = JSON.stringify(initialCart);
        localStorage.setItem(CART_KEY, initialCartJson);
        this.cart$.next(initialCart);
    }

    getCart(): Cart {
        const cartJsonString: string | null = localStorage.getItem(CART_KEY);
        if (cartJsonString) {
            const cart: Cart = JSON.parse(cartJsonString);
            return cart;
        }
        return {};
    }
    setCartItem(cartItem: CartItem, updateCartItem?: boolean) {
        const cart: Cart | null = this.getCart();
        const cartItemExist = cart?.items?.find((item) => item.productId === cartItem?.productId);
        if (cartItemExist && cart) {
            cart?.items?.map((item) => {
                if (item.productId === cartItem.productId) {
                    if (updateCartItem) {
                        return (item.quantity = cartItem.quantity);
                    } else {
                        const value = item.quantity;
                        const cartValue = cartItem.quantity;
                        if (value && cartValue) return value + cartValue;
                        return null;
                    }
                    return item;
                }
                return null;
            });
        } else {
            return cart?.items?.push(cartItem);
        }

        const cartJson = JSON.stringify(cart);
        localStorage.setItem(CART_KEY, cartJson);
        this.cart$.next(cart);
        return cart;
    }
    deleteCartItem(productId: string) {
        const cart = this.getCart();
        if (cart) {
            const newCart = cart.items?.filter((item) => item.productId !== productId);
            cart.items = newCart;
            const cartJsonString = JSON.stringify(cart);
            localStorage.setItem(CART_KEY, cartJsonString);
            this.cart$.next(cart);
        }
    }
}

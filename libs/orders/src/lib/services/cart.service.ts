import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart';
import { BehaviorSubject } from 'rxjs';

export const CART_KEY = 'cart';
@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart$: BehaviorSubject<Cart | null> = new BehaviorSubject<Cart | null>(this.getCart());

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

    getCart(): Cart | null {
        const cartJsonString: string | null = localStorage.getItem(CART_KEY);
        if (cartJsonString) {
            const cart: Cart = JSON.parse(cartJsonString);
            return cart;
        }
        return null; // Zwracamy null, gdy brak koszyka w localStorage
    }

    setCartItem(cartItem: CartItem, updateCartItem?: boolean) {
        let cart: Cart | null | undefined = this.getCart();

        if (!cart) {
            cart = {
                items: []
            };
        }

        const cartItemExist = cart?.items?.find((item) => item.productId === cartItem.productId);

        if (cartItemExist) {
            cart.items?.forEach((item) => {
                if (item.productId === cartItem.productId) {
                    if (updateCartItem) {
                        if (cartItem.quantity !== undefined) {
                            item.quantity = cartItem.quantity;
                        }
                    } else {
                        if (cartItem.quantity !== undefined && item.quantity !== undefined) {
                            item.quantity += cartItem.quantity;
                        }
                    }
                }
            });
        } else {
            if (cartItem.quantity !== undefined) {
                cart?.items?.push(cartItem);
            }
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

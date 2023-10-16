import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { CartItemDetailed } from '../../models/cart';

@Component({
    selector: 'orders-cart-page',
    templateUrl: './cart-page.component.html',
    styles: []
})
export class CartPageComponent implements OnInit, OnDestroy {
    cartItemsDetailed: CartItemDetailed[] = [];
    endSubs$: Subject<any> = new Subject();
    cartCount = 0;
    constructor(private router: Router, private cartService: CartService, private ordersServices: OrdersService) {}
    onBackToShop() {
        this.router.navigate(['/products']);
    }

    onDeleteCartItem(cartItem: string) {
        this.cartService.deleteCartItem(cartItem);
    }

    ngOnInit(): void {
        this._getCartDetails();
    }

    private _getCartDetails() {
        this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((respCart) => {
            this.cartItemsDetailed = [];

            if (respCart) {
                this.cartCount = respCart?.items?.length ?? 0;
                respCart.items?.forEach((cartItem) => {
                    if (cartItem.productId) {
                        this.ordersServices.getProduct(cartItem.productId).subscribe((products) => {
                            this.cartItemsDetailed.push({
                                product: products,
                                quantity: cartItem.quantity
                            });
                        });
                    }
                });
            }
        });
    }
    onUpdateCartItemQuantity(event: any, cartItem: CartItemDetailed) {
        const newValue = event.value;
        this.cartService.setCartItem(
            {
                productId: cartItem.product.id,
                quantity: newValue
            },
            true
        );
    }
    ngOnDestroy(): void {
        this.endSubs$.complete();
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
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

    onDeleteCartItem(cartItem: CartItemDetailed) {
        this.cartService.deleteCartItem(cartItem);
    }

    ngOnInit(): void {
        this._getCartDetails();
    }

    private _getCartDetails() {
        this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((respCart) => {
            this.cartItemsDetailed = [];
            this.cartCount = respCart?.items.length ?? 0;
            respCart.items?.forEach((cartItem) => {
                this.ordersServices.getProduct(cartItem.productId).subscribe((products) => {
                    this.cartItemsDetailed.push({
                        product: products,
                        quantity: cartItem.quantity
                    });
                });
            });
        });
    }
    onUpdateCartItemQuantity(event, cartItem: CartItemDetailed) {
        this.cartService.setCartItem(
            {
                productId: cartItem.product.id,
                quantity: event.value
            },
            true
        );
    }
    ngOnDestroy(): void {
        this.endSubs$.complete();
    }
}

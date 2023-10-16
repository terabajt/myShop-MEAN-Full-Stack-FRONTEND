import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'orders-cart-icon',
    templateUrl: './cart-icon.component.html',
    styles: []
})
export class CartIconComponent implements OnInit {
    cartCount = 0;
    cartCountString = this.cartCount.toString();
    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.cartService.cart$.subscribe((cart) => {
            const count = cart?.items?.length ?? 0;
            if (count) this.cartCount = count;
        });
        if (this.cartService.getCart()) {
            const count = this.cartService.getCart()?.items?.length;
            if (count) this.cartCount = +count;
        }
    }
}

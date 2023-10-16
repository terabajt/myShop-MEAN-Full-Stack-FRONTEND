import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { CartItem, CartService } from '@webappshop/orders';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'products-product-item',
    templateUrl: './product-item.component.html',
    styles: []
})
export class ProductItemComponent {
    @Input()
    product!: Product;

    constructor(private cartService: CartService, private messageService: MessageService) {}

    onAddProductToCart() {
        const cartItem: CartItem = {
            productId: this.product.id,
            quantity: 1
        };
        this.cartService.setCartItem(cartItem);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is added' });
    }
}

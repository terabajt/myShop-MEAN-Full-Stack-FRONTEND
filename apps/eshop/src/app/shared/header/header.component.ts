import { Component } from '@angular/core';
import { CartService } from '@webappshop/orders';

@Component({
    selector: 'eshop-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    constructor(private cartService: CartService) {
        cartService.initCartLocalStorage();
    }
}

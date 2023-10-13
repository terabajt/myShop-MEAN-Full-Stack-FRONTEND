import { Component, OnInit } from '@angular/core';
import { CartService } from '@webappshop/orders';

@Component({
    selector: 'eshop-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.cartService.initCartLocalStorage();
    }
}

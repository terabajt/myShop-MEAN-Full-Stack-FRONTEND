import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@webappshop/orders';
import { ProductsService } from '@webappshop/products';
import { UsersService } from '@webappshop/users';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    statistics = [];
    constructor(private userService: UsersService, private productsService: ProductsService, private ordersService: OrdersService) {}
    ngOnInit(): void {
        combineLatest([
            this.ordersService.getOrderCount(),
            this.productsService.getProductsCount(),
            this.userService.getUsersCount(),
            this.ordersService.getTotalSales()
        ]).subscribe((val) => {
            this.statistics = val;
        });
    }
}

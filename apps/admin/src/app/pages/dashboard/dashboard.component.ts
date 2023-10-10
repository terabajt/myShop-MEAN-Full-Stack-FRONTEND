import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@webappshop/orders';
import { ProductsService } from '@webappshop/products';
import { UsersService } from '@webappshop/users';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    endsubs$: Subject<any> = new Subject();
    statistics = [];
    constructor(private userService: UsersService, private productsService: ProductsService, private ordersService: OrdersService) {}
    ngOnInit(): void {
        combineLatest([
            this.ordersService.getOrderCount(),
            this.productsService.getProductsCount(),
            this.userService.getUsersCount(),
            this.ordersService.getTotalSales()
        ])
            .pipe(takeUntil(this.endsubs$))
            .subscribe((val) => {
                this.statistics = val;
            });
    }
    ngOnDestroy(): void {
        this.endsubs$.complete();
    }
}

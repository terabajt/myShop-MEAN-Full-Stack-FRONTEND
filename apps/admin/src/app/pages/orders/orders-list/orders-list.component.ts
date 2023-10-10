import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@webappshop/orders';
import { ORDER_STATUS } from '../order.constants';
import { Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent implements OnInit, OnDestroy {
    endsubs$: Subject<any> = new Subject();
    orders: Order[] = [];
    orderStatus = ORDER_STATUS;

    constructor(private ordersService: OrdersService, private router: Router) {}

    onDeleteOrder(orderId: string) {}
    onShowOrder(orderId: string) {
        this.router.navigateByUrl(`orders/${orderId}`);
    }

    ngOnInit(): void {
        this._getOrders();
    }

    private _getOrders() {
        this.ordersService
            .getOrders()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((orders) => {
                this.orders = orders;
            });
    }
    ngOnDestroy(): void {
        this.endsubs$.complete();
    }
}

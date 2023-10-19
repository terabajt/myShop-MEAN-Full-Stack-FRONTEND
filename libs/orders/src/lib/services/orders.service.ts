import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Product } from '@webappshop/products';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    apiURLOrders = environment.apiURL + 'orders';
    apiURLProducts = environment.apiURL + 'products';
    constructor(private http: HttpClient) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiURLOrders}`);
    }
    getOrder(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
    }
    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(`${this.apiURLOrders}`, order);
    }
    deleteOrder(orderId: string) {
        return this.http.delete(`${this.apiURLOrders}/${orderId}`);
    }
    updateOrder(orderStatus: { status: string }, orderId: string) {
        return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStatus);
    }
    getOrderCount(): Observable<number> {
        return this.http.get<number>(`${this.apiURLOrders}/get/count`).pipe(map((res: any) => res.orderCount));
    }
    getTotalSales(): Observable<number> {
        return this.http.get<number>(`${this.apiURLOrders}/get/totalsales`).pipe(map((res: any) => res.totalsales));
    }
    getProduct(productId: string): Observable<Product> {
        return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
    }
}

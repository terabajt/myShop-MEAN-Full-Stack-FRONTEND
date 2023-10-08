import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
// import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    // apiURLOrders = environment.apiURL + 'orders';
    constructor(private http: HttpClient) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>('http://localhost:3000/api/v1/orders');
    }
    getOrder(orderId: string): Observable<Order> {
        return this.http.get<Order>(`http://localhost:3000/api/v1/orders/${orderId}`);
    }
    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>('http://localhost:3000/api/v1/orders', order);
    }
    deleteOrder(orderId: string) {
        return this.http.delete(`http://localhost:3000/api/v1/orders/${orderId}`);
    }
    updateOrder(orderStatus: { status: string }, orderId: string) {
        return this.http.put<Order>(`http://localhost:3000/api/v1/orders/${orderId}`, orderStatus);
    }
}

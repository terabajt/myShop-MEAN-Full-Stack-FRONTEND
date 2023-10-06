import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('http://localhost:3000/api/v1/products');
    }
    getProduct(productId: string): Observable<Product> {
        return this.http.get<Product>(`http://localhost:3000/api/v1/products/${productId}`);
    }
    createProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>('http://localhost:3000/api/v1/products', productData);
    }
    deleteProduct(productId: string) {
        return this.http.delete(`http://localhost:3000/api/v1/products/${productId}`);
    }
    updateProduct(productData: FormData, productId: string) {
        return this.http.put<Product>(`http://localhost:3000/api/v1/products/${productId}`, productData);
    }
}

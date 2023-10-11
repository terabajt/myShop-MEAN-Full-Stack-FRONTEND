import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    apiURLProducts = environment.apiURL + 'products';

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
    getProductsCount(): Observable<number> {
        return this.http.get<number>(`${this.apiURLProducts}/get/count`).pipe(map((res: any) => res.productCount));
    }
    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
    }
}

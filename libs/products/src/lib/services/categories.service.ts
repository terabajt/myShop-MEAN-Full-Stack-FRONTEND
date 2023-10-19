import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    apiURLCategories = environment.apiURL + 'categories';
    constructor(private http: HttpClient) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiURLCategories}`);
    }
    getCategorie(categoryId: string): Observable<Category> {
        return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`);
    }
    createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(`${this.apiURLCategories}`, category);
    }
    deleteCategory(categoryId: string) {
        return this.http.delete(`${this.apiURLCategories}/${categoryId}`);
    }
    updateCategory(category: Category) {
        return this.http.put<Category>(`${this.apiURLCategories}/${category.id}`, category);
    }
}

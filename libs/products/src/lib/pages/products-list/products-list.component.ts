import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';

import { Product } from '../../models/product';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categories: Category[] = [];
    isCategoryPage = true;
    endSubs$: Subject<any> = new Subject();

    constructor(private productsService: ProductsService, private categoryService: CategoriesService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            params['categoryid'] ? this._getProducts([params['categoryid']]) : this._getProducts();
            params['categoryid'] ? (this.isCategoryPage = true) : (this.isCategoryPage = false);
        });
        this._getCategories();
    }

    private _getProducts(categoriesFilter?: (string | undefined)[] | undefined) {
        return this.productsService
            .getProducts(categoriesFilter)
            .pipe(takeUntil(this.endSubs$))
            .subscribe((products) => {
                this.products = products;
            });
    }
    private _getCategories() {
        return this.categoryService
            .getCategories()
            .pipe(takeUntil(this.endSubs$))
            .subscribe((categories) => {
                this.categories = categories;
            });
    }
    categoryFilter() {
        const selectedCategories = this.categories.filter((category) => category.checked).map((category) => category.id);
        this._getProducts(selectedCategories);
    }
    ngOnDestroy(): void {
        this.endSubs$.complete();
    }
}

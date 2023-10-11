import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'products-categories-banner',
    templateUrl: './categories-banner.component.html',
    styles: []
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    endsub$: Subject<any> = new Subject();
    constructor(private categoriesServices: CategoriesService) {}

    ngOnInit(): void {
        this.categoriesServices
            .getCategories()
            .pipe(takeUntil(this.endsub$))
            .subscribe((categories) => {
                this.categories = categories;
            });
    }
    ngOnDestroy(): void {
        this.endsub$.complete();
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@webappshop/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    endsubs$: Subject<any> = new Subject();

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private categoriesService: CategoriesService
    ) {}

    ngOnInit(): void {
        this._getCategories();
    }
    onDeleteCategory(categoryId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoriesService
                    .deleteCategory(categoryId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe(
                        () => {
                            this._getCategories();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is deleted' });
                        },
                        () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category is not deleted' });
                        }
                    );
            }
        });
    }
    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((cats) => {
                this.categories = cats;
            });
    }
    onUpdateCategory(categoryId: string) {
        this.router.navigateByUrl(`categories/form/${categoryId}`);
    }

    ngOnDestroy(): void {
        this.endsubs$.complete();
    }
}

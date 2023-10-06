import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductsService } from '@webappshop/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit {
    products: Product[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductsService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this._getProducts();
    }
    onDeleteProduct(productId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this Product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deleteProduct(productId).subscribe(
                    () => {
                        this._getProducts();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is deleted' });
                    },
                    () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product is not deleted' });
                    }
                );
            }
        });
    }
    onUpdateProduct(productId: string) {
        this.router.navigateByUrl(`products/form/${productId}`);
    }

    private _getProducts() {
        this.productService.getProducts().subscribe((products) => {
            this.products = products;
        });
    }
}

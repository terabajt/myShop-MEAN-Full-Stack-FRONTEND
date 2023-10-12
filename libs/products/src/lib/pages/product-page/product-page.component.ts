import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-page.component.html',
    styles: []
})
export class ProductPageComponent implements OnInit, OnDestroy {
    quantity!: number;
    product!: Product;
    endSubs$: Subject<any> = new Subject();
    constructor(private prodService: ProductsService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params['productid']) {
                this._getProduct(params['productid']);
            }
        });
    }
    private _getProduct(id: string) {
        this.prodService
            .getProduct(id)
            .pipe(takeUntil(this.endSubs$))
            .subscribe((res) => [(this.product = res)]);
    }
    ngOnDestroy(): void {
        this.endSubs$.complete();
    }

    onAddProductToCart() {}

    onBuyNow() {}
}

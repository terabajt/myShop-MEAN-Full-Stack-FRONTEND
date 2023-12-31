import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CategoriesService, Category, Product, ProductsService } from '@webappshop/products';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styles: []
})
export class ProductsFormComponent implements OnInit, OnDestroy {
    endsubs$: Subject<any> = new Subject();
    editmode = false;
    categories = <Category[]>[];
    form!: FormGroup;
    image!: string | ArrayBuffer;
    imageDisplay;
    currentProductId: string;

    constructor(
        private categoriesService: CategoriesService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute,
        private productsService: ProductsService
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getCategories();
        this._checkEditMode();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            brand: ['', Validators.required],
            price: ['', Validators.required],
            category: ['', Validators.required],
            countInStock: ['', Validators.required],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required],
            isFeatured: [false]
        });
    }
    private _updateProduct(productFormData: FormData) {
        this.productsService
            .updateProduct(productFormData, this.currentProductId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (product: Product) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} is updated ` });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product is not updated' });
                }
            );
    }
    get productForm() {
        return this.form.controls;
    }
    onSubmit() {
        if (this.form.invalid) {
            return console.log('invalid');
        }
        const productFormData = new FormData();

        Object.keys(this.productForm).map((key) => {
            productFormData.append(key, this.productForm[key].value);
        });
        if (this.editmode) {
            this._updateProduct(productFormData);
        } else {
            this._addProduct(productFormData);
        }
    }
    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
            });
    }
    onImageUpload(event: Event) {
        if (!(event.target instanceof HTMLInputElement)) return;
        const files = event.target.files;

        if (!files?.length) {
            return;
        }
        if (files[0]) {
            this.form.patchValue({ image: files[0] });
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(files[0]);
        }
    }
    private _addProduct(productData: FormData) {
        this.productsService.createProduct(productData).subscribe(
            (product: Product) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} is created` });
                timer(2000)
                    .toPromise()
                    .then(() => {
                        this.location.back();
                    });
            },
            (err) => {
                console.log('error z addproduct', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product is not created' });
            }
        );
    }
    private _checkEditMode() {
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentProductId = params.id;
                this.productsService.getProduct(params.id).subscribe((product) => {
                    this.productForm.name.setValue(product.name);
                    this.productForm.brand.setValue(product.brand);
                    this.productForm.price.setValue(product.price);
                    this.productForm.category.setValue(product.category);
                    this.productForm.countInStock.setValue(product.countInStock);
                    this.productForm.description.setValue(product.description);
                    this.productForm.richDescription.setValue(product.richDescription);
                    this.productForm.image.setValue(product.image);
                    this.productForm.isFeatured.setValue(product.isFeatured);
                    this.imageDisplay = product.image;
                    this.productForm.image.setValidators([]);
                    this.productForm.image.updateValueAndValidity();
                });
            }
        });
    }
    ngOnDestroy(): void {
        this.endsubs$.complete();
    }
}

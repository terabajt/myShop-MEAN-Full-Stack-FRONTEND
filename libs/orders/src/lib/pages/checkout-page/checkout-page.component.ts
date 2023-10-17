import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UsersService } from '@webappshop/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';

@Component({
    selector: 'orders-checkout-page',
    templateUrl: './checkout-page.component.html',
    styles: []
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private usersServices: UsersService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute,
        private cartService: CartService,
        private ordersService: OrdersService
    ) {}
    onBackToCart() {
        this.router.navigate(['/cart']);
    }

    endsubs$: Subject<any> = new Subject();
    editmode = false;
    users = <User[]>[];
    form!: FormGroup;
    currentUserId = '';
    countries: { id: string; name: string }[] = [];
    orderItems: OrderItem[] = [];
    isSubmitted = false;
    userId = '';
    unsubscribe$: Subject<any> = new Subject();

    ngOnInit(): void {
        this._initForm();
        this._autoFillUserData();
        this._getCartItems();
        this._getUsers();
        this._getCountries();
        // this._checkEditMode();
    }

    private _getCartItems() {
        const cart: Cart | null = this.cartService.getCart();
        if (cart && cart.items) {
            this.orderItems = cart.items.map((item) => {
                return <OrderItem>{
                    product: item.productId,
                    quantity: item.quantity
                };
            });
        }
    }

    private _getCountries() {
        this.countries = this.usersServices.getCountries();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            street: ['', Validators.required],
            apartment: ['', Validators.required],
            zip: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required]
        });
    }
    get userForm() {
        return this.form.controls;
    }

    private _getUsers() {
        this.usersServices
            .getUsers()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((users) => {
                this.users = users;
            });
    }

    private _addUser(user: User) {
        this.usersServices
            .createUser(user)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (user: User) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${user.name} is created` });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User is not created' });
                }
            );
    }

    ngOnDestroy(): void {
        this.endsubs$.complete();
        this.unsubscribe$.complete();
    }
    onPlaceOrder() {
        this.isSubmitted = true;
        if (this.userForm['invalid']) {
            return;
        }
        const order: Order = {
            orderItems: this.orderItems,
            shippingAddress1: this.userForm['street'].value,
            shippingAddress2: this.userForm['apartment'].value,
            city: this.userForm['city'].value,
            zip: this.userForm['zip'].value,
            country: this.userForm['country'].value,
            phone: this.userForm['phone'].value,
            status: 0,
            user: this.userId,
            dateOrdered: `${Date.now()}`
        };
        this.ordersService.createOrder(order).subscribe(
            () => {
                //redirect to thank-you page
                this.cartService.emptyCartLocalStorage();
                this.router.navigate(['/success']);
            },
            () => {
                //TODO
                console.log('Error of create order');
            }
        );
    }

    private _autoFillUserData() {
        this.usersServices.observeCurrentUser().subscribe((user: any) => {
            if (user) {
                this.userId = user.id;
                this.form.controls['name'].setValue(user.name);
                this.form.controls['email'].setValue(user.email);
                this.form.controls['phone'].setValue(user.phone);
                this.form.controls['street'].setValue(user.street);
                this.form.controls['apartment'].setValue(user.apartment);
                this.form.controls['zip'].setValue(user.zip);
                this.form.controls['city'].setValue(user.city);
                this.form.controls['country'].setValue(user.country);
            }
        });
    }
}

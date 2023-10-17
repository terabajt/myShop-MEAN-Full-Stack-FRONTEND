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
import { ORDER_STATUS } from '../../order.constants';

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
    userId = '65129b4d5fb5f193621d7592';
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
            apartament: ['', Validators.required],
            zip: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required]
        });
    }
    // private _updateUser(user: User) {
    //     this.usersServices
    //         .updateUser(user)
    //         .pipe(takeUntil(this.endsubs$))
    //         .subscribe(
    //             (user: User) => {
    //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${user.name} is updated ` });
    //                 timer(1000)
    //                     .toPromise()
    //                     .then(() => {
    //                         this.location.back();
    //                     });
    //             },
    //             () => {
    //                 this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User is not updated' });
    //             }
    //         );
    // }
    get userForm() {
        return this.form.controls;
    }
    // onSubmit() {
    //     if (this.form.invalid) {
    //         return;
    //     }
    //     const order: Order = {
    //         orderItems: this.orderItems,
    //         shippingAddress: this.userForm.street.value,
    //         ShippingAddress2: this.userForm.apartament.value,
    //         city: this.userForm.city.value,
    //         zip: this.userForm.zip.value,
    //         country: this.userForm.country.value,
    //         phone: this.userForm.phone.value,
    //         status: this.userForm.status.value,
    //         totalPrice: this.userForm.totalPrice.value,
    //         user: this.userId,
    //         dateOrdered: `${Date.now()}`
    //     };

    //     if (this.editmode) {
    //         this._updateUser(user);
    //     } else {
    //         this._addUser(user);
    //     }
    // }
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
    // private _checkEditMode() {
    //     this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
    //         if (params['id']) {
    //             this.editmode = true;
    //             this.currentUserId = params['id'];
    //             this.usersServices.getUser(params['id']).subscribe((user) => {
    //                 this.userForm['name'].setValue(user.name);
    //                 this.userForm['email'].setValue(user.email);
    //                 this.userForm['isAdmin'].setValue(user.isAdmin);
    //                 this.userForm['street'].setValue(user.street);
    //                 this.userForm['apartament'].setValue(user.apartament);
    //                 this.userForm['zip'].setValue(user.zip);
    //                 this.userForm['city'].setValue(user.city);
    //                 this.userForm['country'].setValue(user.country);
    //                 this.userForm['password'].setValidators([]);
    //                 this.userForm['password'].updateValueAndValidity();
    //             });
    //         }
    //     });
    // }
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
            shippingAddress: this.userForm['street'].value,
            ShippingAddress2: this.userForm['apartament'].value,
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
        this.usersServices
            .observeCurrentUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((user: User) => {
                if (user) {
                    const userId = user.id;
                    if (typeof userId === 'string') this.userId = userId;
                    this.userForm['name'].setValue(user.name);
                    this.userForm['email'].setValue(user.email);
                    this.userForm['phone'].setValue(user.phone);
                    this.userForm['city'].setValue(user.city);
                    this.userForm['country'].setValue(user.country);
                    this.userForm['zip'].setValue(user.zip);
                    this.userForm['apartament'].setValue(user.apartament);
                    this.userForm['apartament'].setValue(user.street);
                }
            });
    }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@webappshop/users';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
    selector: 'admin-users-form',
    templateUrl: './users-form.component.html'
})
export class UsersFormComponent implements OnInit {
    editmode = false;
    users = <User[]>[];
    form!: FormGroup;
    currentUserId: string;
    countries;

    constructor(
        private usersServices: UsersService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getUsers();
        this._getCountries();
        this._checkEditMode();
    }

    private _getCountries() {
        this.countries = this.usersServices.getCountries();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            isAdmin: [false],
            street: [''],
            apartament: [''],
            zip: [''],
            city: [''],
            country: ['']
        });
    }
    private _updateUser(user: User) {
        this.usersServices.updateUser(user).subscribe(
            (user: User) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${user.name} is updated ` });
                timer(1000)
                    .toPromise()
                    .then(() => {
                        this.location.back();
                    });
            },
            () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User is not updated' });
            }
        );
    }
    get userForm() {
        return this.form.controls;
    }
    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        const user: User = {
            id: this.currentUserId,
            name: this.userForm.name.value,
            password: this.userForm.password.value,
            email: this.userForm.email.value,
            phone: this.userForm.phone.value,
            isAdmin: this.userForm.isAdmin.value,
            street: this.userForm.street.value,
            apartament: this.userForm.apartament.value,
            zip: this.userForm.zip.value,
            city: this.userForm.city.value,
            country: this.userForm.country.value
        };

        if (this.editmode) {
            this._updateUser(user);
        } else {
            this._addUser(user);
        }
    }
    private _getUsers() {
        this.usersServices.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

    private _addUser(user: User) {
        this.usersServices.createUser(user).subscribe(
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
    private _checkEditMode() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentUserId = params.id;
                this.usersServices.getUser(params.id).subscribe((user) => {
                    this.userForm.name.setValue(user.name);
                    this.userForm.email.setValue(user.email);
                    this.userForm.isAdmin.setValue(user.isAdmin);
                    this.userForm.street.setValue(user.street);
                    this.userForm.apartament.setValue(user.apartament);
                    this.userForm.zip.setValue(user.zip);
                    this.userForm.city.setValue(user.city);
                    this.userForm.country.setValue(user.country);
                    this.userForm.password.setValidators([]);
                    this.userForm.password.updateValueAndValidity();
                });
            }
        });
    }
}

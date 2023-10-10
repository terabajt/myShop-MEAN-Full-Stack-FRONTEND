import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    loginFormGroup: FormGroup;
    authError = false;
    errorMessage = 'Email or password are wrong.';
    constructor(private formBuilder: FormBuilder, private auth: AuthService, private localstorageService: LocalstorageService, private router: Router) {}

    ngOnInit(): void {
        this._initLoginForms();
    }

    private _initLoginForms() {
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    get loginForm() {
        return this.loginFormGroup.controls;
    }

    onSubmit() {
        const loginData = {
            email: this.loginForm.email.value,
            password: this.loginForm.password.value
        };
        this.auth.login(loginData.email, loginData.password).subscribe(
            (user) => {
                this.authError = false;
                this.localstorageService.setToken(user.token);
                this.router.navigate(['/']);
            },
            (error: HttpErrorResponse) => {
                this.authError = true;
                if (error.status !== 400) {
                    this.errorMessage = 'Error in the SERVER, please try again later.';
                }
            }
        );
    }
}

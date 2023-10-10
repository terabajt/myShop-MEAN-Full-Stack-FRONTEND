import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    }
];
@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, RouterModule.forChild(routes)],
    declarations: [LoginComponent]
})
export class UsersModule {}

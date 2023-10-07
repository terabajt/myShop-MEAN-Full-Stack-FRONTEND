import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService, User } from '@webappshop/users';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
    users: User[] = [];

    constructor(
        private usersService: UsersService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getUsers();
    }

    private _getUsers() {
        this.usersService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

    _getCountry(code: string) {
        return this.usersService.getCountry(code);
    }

    onDeleteUser(userId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this User?',
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService.deleteUser(userId).subscribe(
                    () => {
                        this._getUsers();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User is deleted' });
                    },
                    () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User is not deleted' });
                    }
                );
            }
        });
    }

    onUpdateUser(userId: string) {
        this.router.navigateByUrl(`users/form/${userId}`);
    }
}

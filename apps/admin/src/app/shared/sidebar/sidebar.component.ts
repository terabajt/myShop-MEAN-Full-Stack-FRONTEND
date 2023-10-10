import { Component } from '@angular/core';
import { AuthService } from '@webappshop/users';

@Component({
    selector: 'admin-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
    constructor(private authService: AuthService) {}

    onLogoutUser() {
        this.authService.logout();
    }
}

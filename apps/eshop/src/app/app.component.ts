import { Component, OnInit } from '@angular/core';
import { UsersService } from '@webappshop/users';

@Component({
    selector: 'eshop-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private usersService: UsersService) {}
    title = 'eshop';

    ngOnInit(): void {
        this.usersService.initAppSession();
    }
}

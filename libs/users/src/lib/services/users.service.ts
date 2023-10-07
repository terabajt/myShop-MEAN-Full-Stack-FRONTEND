import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';
declare const require: (arg0: string) => countriesLib.LocaleData;

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient) {
        countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    }

    getCountries(): { id: string; name: string }[] {
        return Object.entries(countriesLib.getNames('en', { select: 'official' })).map((entry) => {
            return {
                id: entry[0],
                name: entry[1]
            };
        });
    }

    getCountry(code: string) {
        return countriesLib.getName(code, 'en', { select: 'official' });
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:3000/api/v1/users');
    }
    getUser(userId: string): Observable<User> {
        return this.http.get<User>(`http://localhost:3000/api/v1/users/${userId}`);
    }
    createUser(user: User): Observable<User> {
        return this.http.post<User>('http://localhost:3000/api/v1/users', user);
    }
    deleteUser(userId: string) {
        return this.http.delete(`http://localhost:3000/api/v1/users/${userId}`);
    }
    updateUser(user: User) {
        return this.http.put<User>(`http://localhost:3000/api/v1/users/${user.id}`, user);
    }
}

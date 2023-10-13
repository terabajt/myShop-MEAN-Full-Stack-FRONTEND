import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    initCartLocalStorage() {
        console.log('inited local storage!');
        // const initialCart = {
        //     items: []
        // };
        // const initialCartJson = JSON.stringify(initialCart);
        // localStorage.setItem('cart', initialCartJson);
    }
}

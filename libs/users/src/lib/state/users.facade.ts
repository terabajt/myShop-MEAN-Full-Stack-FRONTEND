import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as UsersActions from './users.actions';
import * as UsersSelectors from './users.selectors';
import { USERS_FEATURE_KEY, UsersPartialState } from './users.reducer';
import { filter, Observable, take } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class UsersFacade {
    usersFeatureSelector = createFeatureSelector<UsersPartialState>(USERS_FEATURE_KEY);

    currentUser$ = this.store.pipe(select(UsersSelectors.getUser));

    isAuthenticated$ = this.store.pipe(select(UsersSelectors.getUserIsAuth));

    constructor(private store: Store<UsersPartialState>) {}

    buildUserSession() {
        this.store.dispatch(UsersActions.buildUserSession());
    }
}

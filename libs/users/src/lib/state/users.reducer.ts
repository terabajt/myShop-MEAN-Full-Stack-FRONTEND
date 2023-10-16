import { createReducer, on, Action } from '@ngrx/store';

import * as UsersActions from './users.actions';
import { User } from '../models/user';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
    user: User | null;
    isAuthenricated: boolean;
}

export interface UsersPartialState {
    readonly [USERS_FEATURE_KEY]: UsersState;
}

export const initialUsersState: UsersState = {
    user: null,
    isAuthenricated: false
};
const usersReducer = createReducer(
    initialUsersState,
    on(UsersActions.buildUserSession, (state) => ({
        ...state
    })),
    on(UsersActions.buildUserSessionSuccess, (state, action) => ({ ...state, user: action.user, isAuthenricated: true })),
    on(UsersActions.buildUserSessionFailed, (state) => ({ ...state, user: null, isAuthenricated: false }))
);

export function reducer(state: UsersState | undefined, action: Action) {
    return usersReducer(state, action);
}

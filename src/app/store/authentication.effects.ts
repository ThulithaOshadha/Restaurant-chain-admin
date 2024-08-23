import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { logout, logoutSuccess} from './authentication.actions';

@Injectable()
export class AuthenticationEffects {
 
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );
 
  constructor (@Inject(Actions) private actions$: Actions) { }
 
}
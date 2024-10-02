import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  if (accessToken && !req.url.includes('/api/auth/refresh')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/api/auth/refresh')) {
        if (!authService.refreshInProgress) {
          authService.refreshInProgress = true;
          authService.refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response) => {
              authService.refreshInProgress = false;
              authService.refreshTokenSubject.next(response.access_token);
              return next(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.access_token}`,
                  },
                })
              );
            }),
            catchError((error) => {
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => error);
            })
          );
        }
        return authService.refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) => {
            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              })
            );
          })
        );
      }
      return throwError(() => error);
    })
  );
};

import {
  HttpBackend,
  HttpClient,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

export const API_BASE_URL = 'http://localhost:8080';
export const OAUTH2_AUTHORIZE_URI = '/oauth2/authorize';
export const UI_BASE_URL = 'http://localhost:4200';

export const GOOGLE_AUTH_URL = `${API_BASE_URL}${OAUTH2_AUTHORIZE_URI}/google?redirect_uri=${UI_BASE_URL}/login`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public refreshInProgress = false;
  refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(private router: Router, private http: HttpClient) {}

  public getAccessToken(): string | null {
    return (
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    );
  }

  public getRefreshToken(): string | null {
    return (
      localStorage.getItem('refresh_token') ||
      sessionStorage.getItem('refresh_token')
    );
  }

  public retrieveUser(): any {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public storeTokens(
    tokens: AuthenticationResponse,
    rememberMe: boolean
  ): void {
    if (rememberMe) {
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
    } else {
      sessionStorage.setItem('access_token', tokens.access_token);
      sessionStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }

  private storeUser(user: any, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  public isLoggedIn(): boolean {
    return !!this.retrieveUser();
  }

  public login(
    request: { email: string; password: string },
    rememberMe: boolean
  ): Observable<void> {
    return new Observable((observer) => {
      this.http
        .post<AuthenticationResponse>(API_BASE_URL + '/api/auth/login', request)
        .subscribe({
          next: ({ access_token, refresh_token }) => {
            this.storeTokens({ access_token, refresh_token }, rememberMe);
            observer.next();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  public refreshToken(): Observable<AuthenticationResponse> {
    const rememberMe = !!localStorage.getItem('access_token');
    const refreshToken = this.getRefreshToken();

    return this.http
      .post<AuthenticationResponse>(`${API_BASE_URL}/api/auth/refresh`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response, rememberMe);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  public register(
    request: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    },
    rememberMe: boolean
  ): Observable<void> {
    return new Observable((observer) => {
      this.http
        .post<AuthenticationResponse>(
          API_BASE_URL + '/api/auth/register',
          request
        )
        .subscribe({
          next: ({ access_token, refresh_token }) => {
            this.storeTokens({ access_token, refresh_token }, rememberMe);
            observer.next();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  public getUser(rememberMe: boolean): Observable<void> {
    return new Observable((observer) => {
      this.http.get(API_BASE_URL + '/api/auth/me').subscribe({
        next: (user) => {
          this.storeUser(user, rememberMe);
          observer.next();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

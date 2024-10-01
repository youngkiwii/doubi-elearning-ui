import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputModule } from '@spartan-ng/ui-input-helm';
import { buttonVariants } from '@spartan-ng/ui-button-helm';
import { AuthService, GOOGLE_AUTH_URL } from '../auth/auth.service';
import { AuthProvider } from '../models/AuthProvider';
import { HlmCheckboxModule } from '@spartan-ng/ui-checkbox-helm';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HlmButtonModule,
    ReactiveFormsModule,
    HlmFormFieldModule,
    HlmInputModule,
    RouterModule,
    HlmCheckboxModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public buttonVariants = buttonVariants;
  public AuthProvider = AuthProvider;

  public form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  public ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.route.queryParams.subscribe((params) => {
      const access_token = params['access_token'];
      const refresh_token = params['refresh_token'];
      if (!access_token || !refresh_token) return;

      this.authService.storeTokens({ access_token, refresh_token }, true);
      this.authService.getUser(true).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.authService.logout();
        },
      });
    });
  }

  public onLogin(): void {
    if (this.form.invalid) return;
    const { email, password, rememberMe } = this.form.value;
    this.authService.login({ email, password }, rememberMe).subscribe({
      next: () => {
        this.authService.getUser(rememberMe).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: () => {
            this.authService.logout();
          },
        });
      },
    });
  }

  public loginWithProvider(provider: AuthProvider) {
    switch (provider) {
      case AuthProvider.google:
        window.location.href = GOOGLE_AUTH_URL;
        break;
      default:
        break;
    }
  }
}

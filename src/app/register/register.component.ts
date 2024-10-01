import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService, GOOGLE_AUTH_URL } from '../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AuthProvider } from '../models/AuthProvider';
import { buttonVariants, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputModule } from '@spartan-ng/ui-input-helm';
import { HlmCheckboxModule } from '@spartan-ng/ui-checkbox-helm';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HlmButtonModule,
    ReactiveFormsModule,
    HlmFormFieldModule,
    HlmInputModule,
    RouterModule,
    HlmCheckboxModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public buttonVariants = buttonVariants;
  public AuthProvider = AuthProvider;

  public form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  public ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  public onRegister(): void {
    if (this.form.invalid) return;
    const { firstname, lastname, email, password, rememberMe } =
      this.form.value;
    this.authService
      .register({ email, password, firstname, lastname }, rememberMe)
      .subscribe({
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

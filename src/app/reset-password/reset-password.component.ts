import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { buttonVariants, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmIconModule } from '@spartan-ng/ui-icon-helm';
import { HlmInputModule } from '@spartan-ng/ui-input-helm';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    HlmFormFieldModule,
    ReactiveFormsModule,
    HlmIconModule,
    RouterModule,
    HlmInputModule,
    HlmButtonModule,
  ],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideEye,
      lucideEyeOff,
    }),
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  public buttonVariants = buttonVariants;
  public error = '';

  public form: FormGroup = this.formBuilder.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: (form: FormGroup) => {
        const { password, confirmPassword } = form.value;
        if (password !== confirmPassword) {
          this.form.get('confirmPassword')?.markAsTouched();
          this.form.get('password')?.markAsTouched();
          form.controls['confirmPassword'].setErrors({
            passwordMismatch: true,
          });
        } else {
          form.controls['confirmPassword'].setErrors(null);
        }
        return password === confirmPassword ? null : { passwordMismatch: true };
      },
    }
  );
  public hidePassword = true;

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      this.authService.verifyResetToken(token).subscribe({
        error: () => {
          this.router.navigate(['/login']);
        },
      });
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    const { token } = this.route.snapshot.queryParams;
    const { password } = this.form.value;

    this.authService.resetPassword(token, password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error =
          error.error.message || 'Une erreur est survenue, veuillez réessayer.';
      },
    });
  }
}

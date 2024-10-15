import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { buttonVariants, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmIconModule, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputModule } from '@spartan-ng/ui-input-helm';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmFormFieldModule,
    RouterLink,
    HlmInputModule,
    HlmButtonModule,
    HlmIconModule,
    CommonModule,
  ],
  providers: [
    provideIcons({
      lucideArrowLeft,
    }),
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  public buttonVariants = buttonVariants;
  public success = '';

  public form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public onSubmit(): void {
    this.success = '';
    if (this.form.invalid) {
      return;
    }

    const { email } = this.form.value;

    this.authService.forgotPassword(email).subscribe(() => {
      this.success =
        'An email has been sent to you with instructions on how to reset your password.';
    });
  }
}

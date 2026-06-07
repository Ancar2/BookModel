import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    errorMessage = '';

    onSubmit(): void {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.getRawValue();

            this.authService.login({ email, password }).subscribe({
                next: () => {
                    this.router.navigate(['/']); // Redirect to home/dashboard
                },
                error: (err) => {
                    console.error(err);
                    this.errorMessage = err.error?.message || 'Invalid email or password';
                }
            });
        }
    }
}

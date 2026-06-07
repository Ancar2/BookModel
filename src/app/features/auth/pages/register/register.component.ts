import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm = this.fb.nonNullable.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    errorMessage = '';

    onSubmit(): void {
        if (this.registerForm.valid) {
            const { name, email, password } = this.registerForm.getRawValue();

            this.authService.register({ name, email, password }).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Registration failed';
                }
            });
        }
    }
}

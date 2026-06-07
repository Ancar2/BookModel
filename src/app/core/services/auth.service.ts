import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthResponse {
    success: true;
    data: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    // State (Signals)
    private currentUserSignal = signal<User | null>(null);

    // Computed
    public currentUser = this.currentUserSignal.asReadonly();
    public isAuthenticated = computed(() => !!this.currentUserSignal());

    constructor() {
        this.checkAuthStatus();
    }

    // Check valid session (Cookie based)
    checkAuthStatus(): void {
        this.http.get<User>('/api/auth/me').subscribe({
            next: (user) => this.currentUserSignal.set(user),
            error: () => this.currentUserSignal.set(null)
        });
    }

    login(credentials: { email: string, password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
            tap(res => {
                this.currentUserSignal.set(res.data);
            })
        );
    }

    register(userData: { name: string, email: string, password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/api/auth/register', userData).pipe(
            tap(res => {
                this.currentUserSignal.set(res.data);
            })
        );
    }

    logout(): void {
        this.http.post('/api/auth/logout', {}).subscribe(() => {
            this.currentUserSignal.set(null);
            this.router.navigate(['/auth/login']);
        });
    }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { HomeComponent } from './features/home/pages/home/home.component';

export const titulosRutas = {
    home: 'Model Book',
    login: 'Login',
    register: 'Registro',
    dashboard: 'Dashboard'
};

export const rutasPublicas: Routes = [
    {
        path: '',
        title: titulosRutas.home,
        component: HomeComponent
    },
    {
        path: 'auth/login',
        title: titulosRutas.login,
        component: LoginComponent
    },
    {
        path: 'auth/register',
        title: titulosRutas.register,
        component: RegisterComponent
    }
];

export const rutasPrivadas: Routes = [
    // Aquí irán las rutas protegidas
];

export const routes: Routes = [
    ...rutasPublicas,
    ...rutasPrivadas
];

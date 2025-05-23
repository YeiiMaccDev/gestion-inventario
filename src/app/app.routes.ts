import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { HomeComponent } from './home/home.component';
import { TipoProductosComponent } from './tipo-productos/tipo-productos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { LotesComponent } from './lotes/lotes.component';
import { InventarioComponent } from './inventario/inventario.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' }, // Redirección por defecto dentro del dashboard
      { path: 'overview', component: HomeComponent },
      { path: 'tipo-productos', component: TipoProductosComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'lotes', component: LotesComponent },
      { path: 'inventario', component: InventarioComponent },
      // ... otras rutas del dashboard
    ]
  }
  // ... otras rutas fuera del dashboard
];
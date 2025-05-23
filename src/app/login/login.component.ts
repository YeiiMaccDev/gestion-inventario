import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Asegúrate de que tu componente sea standalone si usas la nueva estructura de Angular
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = ''; // Para mostrar mensajes de error
  loginSuccess = false; // Para mostrar mensaje de éxito temporal

  constructor(
    private router: Router,
    private authService: AuthService // <--- Inyecta el AuthService
  ) { }

  onSubmit() {
    this.errorMessage = ''; // Limpia cualquier mensaje de error anterior
    this.loginSuccess = false; // Limpia el mensaje de éxito

    this.authService.login({ nombre: this.username, clave: this.password }).subscribe({
      next: (response) => {
        console.log('Respuesta del login:', response);
        this.loginSuccess = true;
        this.errorMessage = ''; // Limpiar cualquier error previo

        // Opcional: Puedes mostrar un mensaje de éxito por un momento
        setTimeout(() => {
          // Redirigir a una página de inicio o dashboard después de un login exitoso
          // Por ejemplo, si tienes una ruta '/dashboard'
          this.router.navigate(['/dashboard']);
          // O dependiendo del rol:
          // if (this.authService.isAdministrator()) {
          //   this.router.navigate(['/admin-dashboard']);
          // } else {
          //   this.router.navigate(['/user-dashboard']);
          // }
        }, 1000); // Retraso de 1 segundo para ver el mensaje de éxito

      },
      error: (error) => {
        console.error('Error durante el login:', error);
        // Manejo de errores basado en la respuesta del backend
        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado al intentar iniciar sesión. Intenta de nuevo.';
        }
        this.loginSuccess = false;
      }
    });
  }
}
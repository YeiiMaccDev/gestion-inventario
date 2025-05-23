import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importa NgForm si lo necesitas para #registerForm
import { NgIf, CommonModule } from '@angular/common'; // Asegúrate de importar NgIf y CommonModule si es necesario para standalone
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true, // Si tu proyecto es standalone, asegúrate de que esto esté presente
  imports: [FormsModule, NgIf, CommonModule], // Añade CommonModule si lo necesitas para NgIf u otros pipes/directivas
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  rol = 'Analista'; // Valor por defecto
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.errorMessage = ''; // Limpiar mensajes de error anteriores
    this.successMessage = ''; // Limpiar mensajes de éxito anteriores

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Preparar los datos para el registro
    const userData = {
      nombre: this.username,
      clave: this.password,
      rol: this.rol
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.successMessage = 'Usuario registrado exitosamente. Redirigiendo a la página de inicio de sesión...';
        // Puedes redirigir al login después de un registro exitoso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirige después de 2 segundos para que el usuario vea el mensaje
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        if (error.status === 409) { // Conflict: Nombre de usuario ya existe
          this.errorMessage = 'El nombre de usuario ya existe. Por favor, elige otro.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado al registrar el usuario. Intenta de nuevo.';
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
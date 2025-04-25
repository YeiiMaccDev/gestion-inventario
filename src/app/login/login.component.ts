import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = ''; // Para mostrar mensajes de error

  constructor(private router: Router) { }

  onSubmit() {
    // Aquí iría la lógica de autenticación real (llamada a tu backend)

    // Simulación de inicio de sesión exitoso
    if (this.username === 'admin_inventario@gmail.com' && this.password === 'inventarioLZYM') {
      console.log('Inicio de sesión exitoso');
      this.router.navigate(['/dashboard']); // Redirige al layout del dashboard
    } else {
      console.log('Credenciales incorrectas');
      this.errorMessage = 'Usuario o contraseña incorrectos.'; // Muestra un mensaje de error
    }
  }
}
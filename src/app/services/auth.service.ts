import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // Importa tap para efectos secundarios
import { Router } from '@angular/router'; // Importa Router para la navegación

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000//api'; // Asegúrate de que esta URL coincida con tu backend Flask
  private currentUserRol: string | null = null;
  private currentUserName: string | null = null;
  private currentUserId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Al iniciar el servicio, intenta cargar los datos del usuario desde el almacenamiento local
    // Esto es útil para mantener la sesión si el usuario recarga la página
    this.loadUserDataFromLocalStorage();
  }

  // Carga los datos del usuario del localStorage
  private loadUserDataFromLocalStorage(): void {
    const rol = localStorage.getItem('userRol');
    const username = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    if (rol && username && userId) {
      this.currentUserRol = rol;
      this.currentUserName = username;
      this.currentUserId = parseInt(userId, 10);
    }
  }

  // Guarda los datos del usuario en el localStorage
  private saveUserDataToLocalStorage(rol: string, username: string, userId: number): void {
    localStorage.setItem('userRol', rol);
    localStorage.setItem('userName', username);
    localStorage.setItem('userId', userId.toString());
    this.currentUserRol = rol;
    this.currentUserName = username;
    this.currentUserId = userId;
  }

  // Elimina los datos del usuario del localStorage
  private clearUserDataFromLocalStorage(): void {
    localStorage.removeItem('userRol');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    this.currentUserRol = null;
    this.currentUserName = null;
    this.currentUserId = null;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Asumiendo que el backend devuelve { message: "Login exitoso", user_id: N, username: "usuario", rol: "Rol" }
        if (response && response.user_id && response.username && response.rol) {
          this.saveUserDataToLocalStorage(response.rol, response.username, response.user_id);
          console.log('Login exitoso. Rol:', this.currentUserRol);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    this.clearUserDataFromLocalStorage();
    this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
  }

  isAuthenticated(): boolean {
    return this.currentUserRol !== null;
  }

  getUserRol(): string | null {
    return this.currentUserRol;
  }

  getUserName(): string | null {
    return this.currentUserName;
  }

  getUserId(): number | null {
    return this.currentUserId;
  }

  // Métodos para verificar roles
  isAdministrator(): boolean {
    return this.currentUserRol === 'Administrador';
  }

  isAnalyst(): boolean {
    return this.currentUserRol === 'Analista';
  }
}
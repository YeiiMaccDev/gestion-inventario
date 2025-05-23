import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la interfaz de la Categoría basada en tu DB (solo id y nombre)
export interface Categoria {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:5000/api/categorias_producto'; // URL base para las categorías en tu backend

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Obtener una categoría por ID
  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva categoría
  createCategoria(nombre: string): Observable<any> {
    // El backend solo espera el 'nombre'
    return this.http.post<any>(this.apiUrl, { nombre });
  }

  // Actualizar una categoría existente
  updateCategoria(id: number, nombre: string): Observable<any> {
    // El backend solo espera el 'nombre'
    return this.http.put<any>(`${this.apiUrl}/${id}`, { nombre });
  }

  // Eliminar una categoría
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
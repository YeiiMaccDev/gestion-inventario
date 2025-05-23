import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la interfaz del Tipo de Producto
export interface TipoProducto {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService {
  private apiUrl = 'http://localhost:5000/api/tipos_producto'; // URL base para los tipos de producto en tu backend

  constructor(private http: HttpClient) { }

  // Obtener todos los tipos de producto
  getTiposProducto(): Observable<TipoProducto[]> {
    return this.http.get<TipoProducto[]>(this.apiUrl);
  }

  // Obtener un tipo de producto por ID
  getTipoProductoById(id: number): Observable<TipoProducto> {
    return this.http.get<TipoProducto>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo tipo de producto
  createTipoProducto(nombre: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { nombre });
  }

  // Actualizar un tipo de producto existente
  updateTipoProducto(id: number, nombre: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { nombre });
  }

  // Eliminar un tipo de producto
  deleteTipoProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
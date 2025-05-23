import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para los objetos anidados (Producto y Lote) que son parte del registro de inventario
export interface ProductoInventario {
  id: number;
  nombre: string;
}

export interface LoteInventario {
  id: number; // El ID del lote está directamente aquí, no id_lote
  codigo_lote: string;
}

// Interfaz para el modelo de Registro de Inventario
export interface InventarioRegistro {
  id?: number; // Opcional para la creación (el backend lo genera)
  producto: ProductoInventario; // Objeto anidado con id y nombre
  lote: LoteInventario; // Objeto anidado con id y codigo_lote
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost:5000/api/inventario';

  constructor(private http: HttpClient) { }

  getInventario(): Observable<InventarioRegistro[]> {
    return this.http.get<InventarioRegistro[]>(this.apiUrl);
  }

  createInventario(inventario: { id_producto: number, id_lote: number, stock: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, inventario);
  }

  updateInventario(id: number, inventario: { id_producto: number, id_lote: number, stock: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, inventario);
  }

  deleteInventario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
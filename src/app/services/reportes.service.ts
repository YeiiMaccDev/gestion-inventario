import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para el producto a vencer, basada en la respuesta de tu backend
export interface ProductoAVencer {
  id_producto: number;
  producto_nombre: string;
  codigo_lote: string;
  stock: number;
  fecha_vencimiento: string; // La fecha se devuelve como string formateado 'YYYY-MM-DD'
  id_lote: number;
}

// Interfaz para el producto con menor stock
export interface ProductoMenosStock {
  id_producto: number;
  producto_nombre: string;
  total_stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:5000/api/reportes/inventario';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene productos próximos a vencer.
   * @param dias Número de días en el futuro para considerar como "a vencer".
   * @returns Un Observable con un array de productos.
   */
  getProductosAVencer(dias: number = 30): Observable<ProductoAVencer[]> {
    let params = new HttpParams().set('dias', dias.toString());
    return this.http.get<ProductoAVencer[]>(`${this.apiUrl}/a_vencer`, { params });
  }

  /**
   * Obtiene productos con menor stock.
   * @param limite El número de productos con menor stock a devolver (por defecto 5).
   * @returns Un Observable con un array de ProductoMenosStock.
   */
  getProductosMenosStock(limite: number = 5): Observable<ProductoMenosStock[]> {
    let params = new HttpParams().set('limite', limite.toString());
    return this.http.get<ProductoMenosStock[]>(`${this.apiUrl}/menos_stock`, { params });
  }

  // Puedes añadir aquí métodos para otros reportes si los implementas en el backend
}
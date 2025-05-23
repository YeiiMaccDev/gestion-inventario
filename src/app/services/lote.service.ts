import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para el modelo de Lote
export interface Lote {
  id_lote?: number; // Opcional para la creación
  codigo_lote: string;
  fecha_ingreso: string; // Se usará string para facilitar el envío/recepción de fechas
  fecha_vencimiento?: string | null; // Puede ser null
}

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private apiUrl = 'http://localhost:5000/api/lotes'; // Asegúrate que esta URL coincida con tu backend

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los lotes.
   * @returns Un Observable con un array de lotes.
   */
  getLotes(): Observable<Lote[]> {
    return this.http.get<Lote[]>(this.apiUrl);
  }

  /**
   * Crea un nuevo lote.
   * @param lote El objeto Lote a crear (sin ID_LOTE).
   * @returns Un Observable con la respuesta de la API.
   */
  createLote(lote: { codigo_lote: string, fecha_ingreso: string, fecha_vencimiento?: string | null }): Observable<any> {
    return this.http.post<any>(this.apiUrl, lote);
  }

  /**
   * Actualiza un lote existente.
   * @param id El ID del lote a actualizar.
   * @param lote Los datos actualizados del lote.
   * @returns Un Observable con la respuesta de la API.
   */
  updateLote(id: number, lote: { codigo_lote?: string, fecha_ingreso?: string, fecha_vencimiento?: string | null }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, lote);
  }

  /**
   * Elimina un lote por su ID.
   * @param id El ID del lote a eliminar.
   * @returns Un Observable con la respuesta de la API.
   */
  deleteLote(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
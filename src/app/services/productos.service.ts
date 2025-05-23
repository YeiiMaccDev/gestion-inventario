import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la interfaz del Producto tal como se espera del backend
// Incluye los nombres de tipo y categoría para la visualización en la tabla
export interface Producto {
  idProducto?: number; // Optional because it's generated by the backend on creation
  nombre: string;
  descripcion: string;
  codBarras: string;
  precioCompra: number;
  precioVenta: number;
  idTipoProducto: number;
  nombreTipoProducto?: string; // Added for display purposes (from JOIN in backend)
  idCategoriaProducto: number;
  nombreCategoriaProducto?: string; // Added for display purposes (from JOIN in backend)
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:5000/api/productos'; // URL base para los productos en tu backend

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Obtener un producto por ID
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo producto
  createProducto(producto: Producto): Observable<any> {
    // El backend espera el objeto Producto completo, excepto idProducto
    const payload = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      codBarras: producto.codBarras,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      idTipoProducto: producto.idTipoProducto,
      idCategoriaProducto: producto.idCategoriaProducto
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  // Actualizar un producto existente
  updateProducto(id: number, producto: Producto): Observable<any> {
    // El backend espera el objeto Producto completo, excepto idProducto
    const payload = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      codBarras: producto.codBarras,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      idTipoProducto: producto.idTipoProducto,
      idCategoriaProducto: producto.idCategoriaProducto
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  // Eliminar un producto
  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
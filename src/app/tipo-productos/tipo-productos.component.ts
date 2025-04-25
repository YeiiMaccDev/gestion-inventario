import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

interface TipoProducto {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-tipo-productos',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './tipo-productos.component.html',
  styleUrl: './tipo-productos.component.css'
})
export class TipoProductosComponent implements OnInit {
  tiposProductos: TipoProducto[] = [];
  mostrarModalNuevo = false;
  mostrarModalEditar = false;
  nuevoNombre: string = '';
  editarTipoProductoId: number | null = null;
  editarNombre: string = '';
  apiUrl = 'http://localhost:5000/api/tipos_producto'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarTiposProductos();
  }

  cargarTiposProductos(): void {
    this.http.get<TipoProducto[]>(this.apiUrl).subscribe(
      (data) => {
        this.tiposProductos = data;
      },
      (error) => {
        console.error('Error al cargar los tipos de producto:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }

  abrirModalNuevoTipoProducto() {
    this.mostrarModalNuevo = true;
    this.nuevoNombre = '';
  }

  cerrarModalNuevoTipoProducto() {
    this.mostrarModalNuevo = false;
  }

  guardarNuevoTipoProducto() {
    if (this.nuevoNombre.trim()) {
      this.http.post<TipoProducto>(this.apiUrl, { nombre: this.nuevoNombre.trim() }).subscribe(
        (response) => {
          this.tiposProductos = [...this.tiposProductos, response];
          this.mostrarModalNuevo = false;
          this.nuevoNombre = '';
          console.log('Tipo de producto guardado:', response);
        },
        (error) => {
          console.error('Error al guardar el tipo de producto:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      );
    } else {
      // Optionally add validation feedback
    }
  }

  abrirModalEditarTipoProducto(tipo: TipoProducto) {
    this.mostrarModalEditar = true;
    this.editarTipoProductoId = tipo.id;
    this.editarNombre = tipo.nombre;
  }

  cerrarModalEditarTipoProducto() {
    this.mostrarModalEditar = false;
    this.editarTipoProductoId = null;
    this.editarNombre = '';
  }

  guardarEditarTipoProducto() {
    if (this.editarNombre.trim() && this.editarTipoProductoId !== null) {
      this.http.put<TipoProducto>(`${this.apiUrl}/${this.editarTipoProductoId}`, { nombre: this.editarNombre.trim() }).subscribe(
        (response) => {
          this.tiposProductos = this.tiposProductos.map(tipo =>
            tipo.id === this.editarTipoProductoId ? response : tipo
          );
          this.cerrarModalEditarTipoProducto();
          console.log('Tipo de producto actualizado:', response);
          // Opcional: Mostrar mensaje de éxito
        },
        (error) => {
          console.error('Error al actualizar el tipo de producto:', error);
          // Opcional: Mostrar mensaje de error
        }
      );
    } else {
      // Opcional: Mostrar feedback de validación
    }
  }

  eliminarTipoProducto(id: number): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el tipo de producto con ID ${id}?`)) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.tiposProductos = this.tiposProductos.filter(tipo => tipo.id !== id);
          console.log(`Tipo de producto con ID ${id} eliminado`);
          // Opcional: Mostrar mensaje de éxito
        },
        (error) => {
          console.error(`Error al eliminar el tipo de producto con ID ${id}:`, error);
          // Opcional: Mostrar mensaje de error
        }
      );
    }
  }
}
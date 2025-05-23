import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoProductoService, TipoProducto } from '../services/tipo-producto.service'; // Importa el servicio y la interfaz

@Component({
  selector: 'app-tipo-productos',
  standalone: true, // Si es un componente standalone
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './tipo-productos.component.html',
  styleUrl: './tipo-productos.component.css'
})
export class TipoProductosComponent implements OnInit {
  tiposProductos: TipoProducto[] = [];
  mostrarModalNuevo = false;
  mostrarModalEditar = false;

  // Propiedades para "Agregar Nuevo Tipo de Producto"
  nuevoNombre: string = '';

  // Propiedades para "Editar Tipo de Producto"
  tipoProductoEditando: TipoProducto | null = null;
  editarNombre: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private tipoProductoService: TipoProductoService) { }

  ngOnInit(): void {
    this.cargarTiposProducto(); // Cargar datos al inicializar el componente
  }

  cargarTiposProducto(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.tipoProductoService.getTiposProducto().subscribe({
      next: (data) => {
        this.tiposProductos = data;
      },
      error: (err) => {
        console.error('Error al cargar tipos de producto:', err);
        this.errorMessage = 'No se pudieron cargar los tipos de producto. Intenta de nuevo más tarde.';
      }
    });
  }

  // --- Funciones para el modal "Agregar Nuevo Tipo de Producto" ---
  abrirModalNuevoTipoProducto(): void {
    this.mostrarModalNuevo = true;
    this.nuevoNombre = ''; // Limpiar campo al abrir
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalNuevoTipoProducto(): void {
    this.mostrarModalNuevo = false;
  }

  guardarNuevoTipoProducto(): void {
    if (!this.nuevoNombre.trim()) {
      this.errorMessage = 'El nombre del tipo de producto es requerido.';
      return;
    }

    this.tipoProductoService.createTipoProducto(this.nuevoNombre.trim()).subscribe({
      next: (response) => {
        this.successMessage = 'Tipo de producto creado exitosamente.';
        this.cerrarModalNuevoTipoProducto();
        this.cargarTiposProducto(); // Recargar la lista
        this.nuevoNombre = ''; // Resetear campo
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al guardar nuevo tipo de producto:', err);
        this.errorMessage = err.error?.message || 'Error al crear el tipo de producto. Intenta de nuevo.';
      }
    });
  }

  // --- Funciones para el modal "Editar Tipo de Producto" ---
  abrirModalEditarTipoProducto(tipo: TipoProducto): void {
    this.tipoProductoEditando = { ...tipo }; // Clonar el objeto
    this.editarNombre = tipo.nombre;
    this.mostrarModalEditar = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalEditarTipoProducto(): void {
    this.mostrarModalEditar = false;
    this.tipoProductoEditando = null;
    this.editarNombre = '';
  }

  guardarEditarTipoProducto(): void {
    if (!this.tipoProductoEditando) {
      this.errorMessage = 'No hay tipo de producto seleccionado para editar.';
      return;
    }
    if (!this.editarNombre.trim()) {
      this.errorMessage = 'El nombre del tipo de producto es requerido.';
      return;
    }

    this.tipoProductoService.updateTipoProducto(this.tipoProductoEditando.id, this.editarNombre.trim()).subscribe({
      next: (response) => {
        this.successMessage = 'Tipo de producto actualizado exitosamente.';
        this.cerrarModalEditarTipoProducto();
        this.cargarTiposProducto(); // Recargar la lista
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar tipo de producto:', err);
        this.errorMessage = err.error?.message || 'Error al actualizar el tipo de producto. Intenta de nuevo.';
      }
    });
  }

  // --- Función para Eliminar Tipo de Producto ---
  eliminarTipoProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de producto?')) {
      this.errorMessage = '';
      this.successMessage = '';
      this.tipoProductoService.deleteTipoProducto(id).subscribe({
        next: (response) => {
          this.successMessage = 'Tipo de producto eliminado exitosamente.';
          this.cargarTiposProducto(); // Recargar la lista
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error al eliminar tipo de producto:', err);
          if (err.status === 409) { // Código de conflicto para FK_CONSTRAINT_VIOLATION
            this.errorMessage = err.error?.message || 'No se puede eliminar este tipo de producto porque está siendo utilizado.';
          } else {
            this.errorMessage = err.error?.message || 'Error al eliminar el tipo de producto. Intenta de nuevo.';
          }
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService, InventarioRegistro, ProductoInventario, LoteInventario } from '../services/inventario.service';
import { ProductoService, Producto } from '../services/productos.service'; // Necesitarás un ProductoService
import { LoteService, Lote } from '../services/lote.service'; // Necesitarás un LoteService

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  inventarioRegistros: InventarioRegistro[] = [];
  productosDisponibles: Producto[] = []; // Lista de productos para el dropdown
  lotesDisponibles: Lote[] = []; // Lista de lotes para el dropdown

  mostrarModalNuevo = false;
  mostrarModalEditar = false;

  // Propiedades para "Agregar Nuevo Registro de Inventario"
  nuevoIdProducto: number | null = null;
  nuevoIdLote: number | null = null;
  nuevoStock: number | null = null;

  // Propiedades para "Editar Registro de Inventario"
  inventarioEditando: InventarioRegistro | null = null;
  editarIdProducto: number | null = null;
  editarIdLote: number | null = null;
  editarStock: number | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private inventarioService: InventarioService,
    private productoService: ProductoService, // Inyecta ProductoService
    private loteService: LoteService // Inyecta LoteService
  ) { }

  ngOnInit(): void {
    this.cargarInventario();
    this.cargarProductos(); // Cargar productos al inicio
    this.cargarLotes(); // Cargar lotes al inicio
  }

  cargarInventario(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.inventarioService.getInventario().subscribe({
      next: (data) => {
        this.inventarioRegistros = data;
      },
      error: (err) => {
        console.error('Error al cargar registros de inventario:', err);
        this.errorMessage = 'No se pudieron cargar los registros de inventario. Intenta de nuevo más tarde.';
      }
    });
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productosDisponibles = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorMessage = 'No se pudieron cargar los productos para selección.';
      }
    });
  }

  cargarLotes(): void {
    this.loteService.getLotes().subscribe({
      next: (data) => {
        this.lotesDisponibles = data;
      },
      error: (err) => {
        console.error('Error al cargar lotes:', err);
        this.errorMessage = 'No se pudieron cargar los lotes para selección.';
      }
    });
  }

  // --- Funciones para el modal "Agregar Nuevo Registro" ---
  abrirModalNuevoRegistro(): void {
    this.mostrarModalNuevo = true;
    this.nuevoIdProducto = null;
    this.nuevoIdLote = null;
    this.nuevoStock = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalNuevoRegistro(): void {
    this.mostrarModalNuevo = false;
  }

  guardarNuevoRegistro(): void {
    if (this.nuevoIdProducto === null || this.nuevoIdLote === null || this.nuevoStock === null || this.nuevoStock < 0) {
      this.errorMessage = 'Todos los campos son requeridos y el stock debe ser un número positivo.';
      return;
    }

    const inventarioData = {
      id_producto: this.nuevoIdProducto,
      id_lote: this.nuevoIdLote,
      stock: this.nuevoStock
    };

    this.inventarioService.createInventario(inventarioData).subscribe({
      next: (response) => {
        this.successMessage = 'Registro de inventario creado exitosamente.';
        this.cerrarModalNuevoRegistro();
        this.cargarInventario();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al guardar nuevo registro de inventario:', err);
        this.errorMessage = err.error?.message || 'Error al crear el registro de inventario. Intenta de nuevo.';
      }
    });
  }

  // --- Funciones para el modal "Editar Registro" ---
  abrirModalEditarRegistro(registro: InventarioRegistro): void {
    this.inventarioEditando = { ...registro }; // Clonar el objeto
    this.editarIdProducto = registro.producto.id;
    this.editarIdLote = registro.lote.id;
    this.editarStock = registro.stock;
    this.mostrarModalEditar = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalEditarRegistro(): void {
    this.mostrarModalEditar = false;
    this.inventarioEditando = null;
    this.editarIdProducto = null;
    this.editarIdLote = null;
    this.editarStock = null;
  }

  guardarEdicionRegistro(): void {
    if (!this.inventarioEditando || this.inventarioEditando.id === undefined) {
      this.errorMessage = 'No hay registro de inventario seleccionado para editar.';
      return;
    }
    if (this.editarIdProducto === null || this.editarIdLote === null || this.editarStock === null || this.editarStock < 0) {
      this.errorMessage = 'Todos los campos son requeridos y el stock debe ser un número positivo.';
      return;
    }

    const inventarioData = {
      id_producto: this.editarIdProducto,
      id_lote: this.editarIdLote,
      stock: this.editarStock
    };

    this.inventarioService.updateInventario(this.inventarioEditando.id, inventarioData).subscribe({
      next: (response) => {
        this.successMessage = 'Registro de inventario actualizado exitosamente.';
        this.cerrarModalEditarRegistro();
        this.cargarInventario();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar registro de inventario:', err);
        this.errorMessage = err.error?.message || 'Error al actualizar el registro de inventario. Intenta de nuevo.';
      }
    });
  }

  // --- Función para Eliminar Registro ---
  eliminarRegistro(id: number | undefined): void {
    if (id === undefined) {
      this.errorMessage = 'ID de registro de inventario no válido para eliminar.';
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este registro de inventario?')) {
      this.errorMessage = '';
      this.successMessage = '';
      this.inventarioService.deleteInventario(id).subscribe({
        next: (response) => {
          this.successMessage = 'Registro de inventario eliminado exitosamente.';
          this.cargarInventario();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error al eliminar registro de inventario:', err);
          this.errorMessage = err.error?.message || 'Error al eliminar el registro de inventario. Intenta de nuevo.';
        }
      });
    }
  }
}
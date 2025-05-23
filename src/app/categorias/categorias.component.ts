import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../services/categoria.service'; // Importa el servicio y la interfaz

@Component({
  selector: 'app-categorias',
  standalone: true, // Si es un componente standalone
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit { // Implementa OnInit
  categorias: Categoria[] = []; // Inicializa como un array vacío
  mostrarModalNuevo = false;
  mostrarModalEditar = false; // Nuevo modal para edición
  
  // Propiedades para "Agregar Nueva Categoría"
  nuevoNombre: string = '';
  // nuevaDescripcion: string = ''; // Ya no se necesita para la categoría

  // Propiedades para "Editar Categoría"
  categoriaEditando: Categoria | null = null;
  editarNombre: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private categoriaService: CategoriaService) { } // Inyecta el servicio

  ngOnInit(): void {
    this.cargarCategorias(); // Llama a cargarCategorias al iniciar el componente
  }

  cargarCategorias(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.errorMessage = 'No se pudieron cargar las categorías. Intenta de nuevo más tarde.';
      }
    });
  }

  // --- Funciones para el modal "Agregar Nueva Categoría" ---
  abrirModalNuevoCategoria(): void {
    this.mostrarModalNuevo = true;
    this.nuevoNombre = ''; // Limpiar campos al abrir
    // this.nuevaDescripcion = ''; // No se necesita
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalNuevoCategoria(): void {
    this.mostrarModalNuevo = false;
  }

  guardarNuevaCategoria(): void {
    if (!this.nuevoNombre.trim()) {
      this.errorMessage = 'El nombre de la categoría es requerido.';
      return;
    }

    this.categoriaService.createCategoria(this.nuevoNombre.trim()).subscribe({
      next: (response) => {
        this.successMessage = 'Categoría creada exitosamente.';
        this.cerrarModalNuevoCategoria();
        this.cargarCategorias(); // Recargar la lista para ver el nuevo elemento
        this.nuevoNombre = ''; // Resetear campo
        setTimeout(() => this.successMessage = '', 3000); // Ocultar mensaje después de 3 seg
      },
      error: (err) => {
        console.error('Error al guardar nueva categoría:', err);
        this.errorMessage = err.error?.message || 'Error al crear la categoría. Intenta de nuevo.';
      }
    });
  }

  // --- Funciones para el modal "Editar Categoría" ---
  abrirModalEditarCategoria(categoria: Categoria): void {
    this.categoriaEditando = { ...categoria }; // Clonar el objeto para no modificar el original directamente
    this.editarNombre = categoria.nombre;
    this.mostrarModalEditar = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalEditarCategoria(): void {
    this.mostrarModalEditar = false;
    this.categoriaEditando = null;
    this.editarNombre = '';
  }

  guardarEdicionCategoria(): void {
    if (!this.categoriaEditando) {
      this.errorMessage = 'No hay categoría seleccionada para editar.';
      return;
    }
    if (!this.editarNombre.trim()) {
      this.errorMessage = 'El nombre de la categoría es requerido.';
      return;
    }

    this.categoriaService.updateCategoria(this.categoriaEditando.id, this.editarNombre.trim()).subscribe({
      next: (response) => {
        this.successMessage = 'Categoría actualizada exitosamente.';
        this.cerrarModalEditarCategoria();
        this.cargarCategorias(); // Recargar la lista
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar categoría:', err);
        this.errorMessage = err.error?.message || 'Error al actualizar la categoría. Intenta de nuevo.';
      }
    });
  }

  // --- Función para Eliminar Categoría ---
  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.errorMessage = '';
      this.successMessage = '';
      this.categoriaService.deleteCategoria(id).subscribe({
        next: (response) => {
          this.successMessage = 'Categoría eliminada exitosamente.';
          this.cargarCategorias(); // Recargar la lista
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          if (err.status === 409) { // Código de conflicto para FK_CONSTRAINT_VIOLATION
            this.errorMessage = err.error?.message || 'No se puede eliminar la categoría porque está siendo utilizada.';
          } else {
            this.errorMessage = err.error?.message || 'Error al eliminar la categoría. Intenta de nuevo.';
          }
        }
      });
    }
  }
}
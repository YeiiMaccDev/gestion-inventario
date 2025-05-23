import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common'; // Importa CommonModule (NgFor, NgIf)
import { FormsModule } from '@angular/forms'; // Importa FormsModule para [(ngModel)]
import { LoteService, Lote } from '../services/lote.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-lotes',
  standalone: true, // Componente standalone
  imports: [NgFor, NgIf, FormsModule], // Importa los módulos necesarios
  templateUrl: './lotes.component.html',
  styleUrl: './lotes.component.css' // Usamos .css por consistencia con CategoriasComponent
})
export class LotesComponent implements OnInit {
  lotes: Lote[] = [];
  mostrarModalNuevo = false;
  mostrarModalEditar = false;

  // Propiedades para "Agregar Nuevo Lote"
  nuevoCodigoLote: string = '';
  nuevaFechaIngreso: string = ''; // Usamos string para el input type="date"
  nuevaFechaVencimiento: string | null = null; // Puede ser null

  // Propiedades para "Editar Lote"
  loteEditando: Lote | null = null;
  editarCodigoLote: string = '';
  editarFechaIngreso: string = '';
  editarFechaVencimiento: string | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private loteService: LoteService) { }

  ngOnInit(): void {
    this.cargarLotes();
  }

  cargarLotes(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loteService.getLotes().subscribe({
      next: (data) => {
        // Asegurarse de que las fechas sean cadenas en formato YYYY-MM-DD
        // para que el input type="date" las maneje correctamente.
        this.lotes = data.map(lote => ({
          ...lote,
          fecha_ingreso: lote.fecha_ingreso ? new Date(lote.fecha_ingreso).toISOString().substring(0, 10) : '',
          fecha_vencimiento: lote.fecha_vencimiento ? new Date(lote.fecha_vencimiento).toISOString().substring(0, 10) : null
        }));
      },
      error: (err) => {
        console.error('Error al cargar lotes:', err);
        this.errorMessage = 'No se pudieron cargar los lotes. Intenta de nuevo más tarde.';
      }
    });
  }

  // --- Funciones para el modal "Agregar Nuevo Lote" ---
  abrirModalNuevoLote(): void {
    this.mostrarModalNuevo = true;
    this.nuevoCodigoLote = '';
    this.nuevaFechaIngreso = '';
    this.nuevaFechaVencimiento = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalNuevoLote(): void {
    this.mostrarModalNuevo = false;
  }

  guardarNuevoLote(): void {
    if (!this.nuevoCodigoLote.trim() || !this.nuevaFechaIngreso.trim()) {
      this.errorMessage = 'El código de lote y la fecha de ingreso son requeridos.';
      return;
    }

    const loteData = {
      codigo_lote: this.nuevoCodigoLote.trim(),
      fecha_ingreso: this.nuevaFechaIngreso.trim(),
      fecha_vencimiento: this.nuevaFechaVencimiento?.trim() || null // Asegura que sea null si está vacío
    };

    this.loteService.createLote(loteData).subscribe({
      next: (response) => {
        this.successMessage = 'Lote creado exitosamente.';
        this.cerrarModalNuevoLote();
        this.cargarLotes();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al guardar nuevo lote:', err);
        this.errorMessage = err.error?.message || 'Error al crear el lote. Intenta de nuevo.';
      }
    });
  }

  // --- Funciones para el modal "Editar Lote" ---
  abrirModalEditarLote(lote: Lote): void {
    this.loteEditando = { ...lote }; // Clonar el objeto
    this.editarCodigoLote = lote.codigo_lote;
    this.editarFechaIngreso = lote.fecha_ingreso;
    this.editarFechaVencimiento = lote.fecha_vencimiento || null; // Manejar null
    this.mostrarModalEditar = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalEditarLote(): void {
    this.mostrarModalEditar = false;
    this.loteEditando = null;
    this.editarCodigoLote = '';
    this.editarFechaIngreso = '';
    this.editarFechaVencimiento = null;
  }

  guardarEdicionLote(): void {
    if (!this.loteEditando || this.loteEditando.id_lote === undefined) {
      this.errorMessage = 'No hay lote seleccionado para editar.';
      return;
    }
    if (!this.editarCodigoLote.trim() || !this.editarFechaIngreso.trim()) {
      this.errorMessage = 'El código de lote y la fecha de ingreso son requeridos.';
      return;
    }

    const loteData = {
      codigo_lote: this.editarCodigoLote.trim(),
      fecha_ingreso: this.editarFechaIngreso.trim(),
      fecha_vencimiento: this.editarFechaVencimiento?.trim() || null
    };

    this.loteService.updateLote(this.loteEditando.id_lote, loteData).subscribe({
      next: (response) => {
        this.successMessage = 'Lote actualizado exitosamente.';
        this.cerrarModalEditarLote();
        this.cargarLotes();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar lote:', err);
        this.errorMessage = err.error?.message || 'Error al actualizar el lote. Intenta de nuevo.';
      }
    });
  }

  // --- Función para Eliminar Lote ---
  eliminarLote(id: number | undefined): void {
    if (id === undefined) {
      this.errorMessage = 'ID de lote no válido para eliminar.';
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este lote?')) {
      this.errorMessage = '';
      this.successMessage = '';
      this.loteService.deleteLote(id).subscribe({
        next: (response) => {
          this.successMessage = 'Lote eliminado exitosamente.';
          this.cargarLotes();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error al eliminar lote:', err);
          if (err.status === 409) { // Código de conflicto para FK_CONSTRAINT_VIOLATION
            this.errorMessage = err.error?.message || 'No se puede eliminar el lote porque está siendo utilizado.';
          } else {
            this.errorMessage = err.error?.message || 'Error al eliminar el lote. Intenta de nuevo.';
          }
        }
      });
    }
  }
}
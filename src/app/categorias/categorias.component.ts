import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Component({
  selector: 'app-categorias',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {
  categorias!: Categoria[];
  mostrarModalNuevo = false;
  nuevoNombre: string = '';
  nuevaDescripcion: string = '';

  ngOnInit(): void {
    this.categorias = [
      { id: 1, nombre: 'Electrónica de Consumo' },
      { id: 2, nombre: 'Indumentaria Hombre' },
      { id: 3, nombre: 'Bebidas' },
      { id: 4, nombre: 'Novelas' },
      { id: 5, nombre: 'Herramientas' }
    ];
  }

  abrirModalNuevoCategoria() {
    this.mostrarModalNuevo = true;
    this.nuevoNombre = '';
    this.nuevaDescripcion = '';
  }

  cerrarModalNuevoCategoria() {
    this.mostrarModalNuevo = false;
  }

  guardarNuevaCategoria() {
    if (this.nuevoNombre.trim()) {
      const newId = this.categorias.length > 0 ? Math.max(...this.categorias.map(c => c.id)) + 1 : 1;
      const nuevaCategoria: Categoria = { id: newId, nombre: this.nuevoNombre.trim(), descripcion: this.nuevaDescripcion.trim() };
      this.categorias = [...this.categorias, nuevaCategoria];
      this.mostrarModalNuevo = false;
      this.nuevoNombre = '';
      this.nuevaDescripcion = '';
      // Aquí iría la lógica para guardar en el backend
      console.log('Nueva categoría a guardar:', nuevaCategoria);
    } else {
      // Optionally add validation feedback for the name field
    }
  }

  editarCategoria(id: number): void {
    console.log(`Editar categoría con ID: ${id}`);
    // Lógica para editar la categoría
  }

  eliminarCategoria(id: number): void {
    console.log(`Eliminar categoría con ID: ${id}`);
    this.categorias = this.categorias.filter(categoria => categoria.id !== id);
    // Lógica para eliminar la categoría
  }
}
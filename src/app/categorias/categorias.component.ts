import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-categorias',
  imports: [NgFor],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {
  categorias!: { id: number, nombre: string }[];

  ngOnInit(): void {
    // Datos de ejemplo para categorías
    this.categorias = [
      { id: 1, nombre: 'Electrónica de Consumo' },
      { id: 2, nombre: 'Indumentaria Hombre' },
      { id: 3, nombre: 'Bebidas' },
      { id: 4, nombre: 'Novelas' },
      { id: 5, nombre: 'Herramientas' }
    ];
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

  agregarNuevaCategoria(): void {
    console.log('Agregar nueva categoría');
    // Lógica para mostrar el formulario de agregar categoría
  }
}
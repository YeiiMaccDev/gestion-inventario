import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tipo-productos',
  imports: [NgFor],
  templateUrl: './tipo-productos.component.html',
  styleUrl: './tipo-productos.component.css'
})
export class TipoProductosComponent {
  tiposProductos!: { id: number, nombre: string }[];

  ngOnInit(): void {
    // Datos de ejemplo (simulando la respuesta del backend)
    this.tiposProductos = [
      { id: 1, nombre: 'Electrónicos' },
      { id: 2, nombre: 'Ropa' },
      { id: 3, nombre: 'Alimentos' },
      { id: 4, nombre: 'Libros' }
    ];
  }

  editarTipoProducto(id: number): void {
    console.log(`Editar tipo de producto con ID: ${id}`);
    // Aquí iría la lógica para redirigir al formulario de edición
  }

  eliminarTipoProducto(id: number): void {
    console.log(`Eliminar tipo de producto con ID: ${id}`);
    // Aquí iría la lógica para confirmar y eliminar el tipo de producto
    this.tiposProductos = this.tiposProductos.filter(tipo => tipo.id !== id);
  }
}
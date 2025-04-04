import { NgFor, NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipo-productos',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './tipo-productos.component.html',
  styleUrl: './tipo-productos.component.css'
})
export class TipoProductosComponent {
  tiposProductos!: { id: number, nombre: string }[];
  mostrarModalNuevo = false;
  nuevoNombre: string = '';

  ngOnInit(): void {
    this.tiposProductos = [
      { id: 1, nombre: 'Electrónicos' },
      { id: 2, nombre: 'Ropa' },
      { id: 3, nombre: 'Alimentos' },
      { id: 4, nombre: 'Libros' }
    ];
  }

  abrirModalNuevoTipoProducto() {
    this.mostrarModalNuevo = true;
    this.nuevoNombre = ''; // Reset the input field
  }

  cerrarModalNuevoTipoProducto() {
    this.mostrarModalNuevo = false;
  }

  guardarNuevoTipoProducto() {
    if (this.nuevoNombre.trim()) {
      const newId = this.tiposProductos.length > 0 ? Math.max(...this.tiposProductos.map(t => t.id)) + 1 : 1;
      this.tiposProductos = [...this.tiposProductos, { id: newId, nombre: this.nuevoNombre.trim() }];
      this.mostrarModalNuevo = false;
      this.nuevoNombre = '';
      // Aquí iría la lógica para guardar en el backend
      console.log('Nuevo tipo de producto a guardar:', this.nuevoNombre);
    } else {
      // Optionally add validation feedback
    }
  }

  editarTipoProducto(id: number): void {
    console.log(`Editar tipo de producto con ID: ${id}`);
  }

  eliminarTipoProducto(id: number): void {
    console.log(`Eliminar tipo de producto con ID: ${id}`);
    this.tiposProductos = this.tiposProductos.filter(tipo => tipo.id !== id);
  }
}
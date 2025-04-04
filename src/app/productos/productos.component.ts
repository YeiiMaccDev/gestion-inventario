import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  codBarras: string;
  precioCompra: number;
  precioVenta: number;
  idTipoProducto: number;
  idCategoriaProducto: number;
}

interface TipoProductoLookup {
  id: number;
  nombre: string;
}

interface CategoriaProductoLookup {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-productos',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  productos: Producto[] = [];
  mostrarModalNuevo = false;
  nuevoProducto: Producto = {
    idProducto: 0,
    nombre: '',
    descripcion: '',
    codBarras: '',
    precioCompra: 0,
    precioVenta: 0,
    idTipoProducto: 0,
    idCategoriaProducto: 0
  };

  tiposProductos: TipoProductoLookup[] = [
    { id: 1, nombre: 'Electrónicos' },
    { id: 2, nombre: 'Ropa' },
    { id: 3, nombre: 'Alimentos' },
    { id: 4, nombre: 'Libros' }
  ];

  categoriasProductos: CategoriaProductoLookup[] = [
    { id: 1, nombre: 'Electrónica de Consumo' },
    { id: 2, nombre: 'Indumentaria Hombre' },
    { id: 3, nombre: 'Bebidas' },
    { id: 4, nombre: 'Novelas' },
    { id: 5, nombre: 'Herramientas' }
  ];

  ngOnInit(): void {
    this.productos = [
      { idProducto: 1, nombre: 'Laptop', descripcion: 'Portátil de alto rendimiento', codBarras: '1234567890123', precioCompra: 800, precioVenta: 1200, idTipoProducto: 1, idCategoriaProducto: 1 },
      { idProducto: 2, nombre: 'Camiseta', descripcion: 'Algodón suave', codBarras: '0987654321098', precioCompra: 15, precioVenta: 30, idTipoProducto: 2, idCategoriaProducto: 2 }
    ];
  }

  getNombreTipoProducto(id: number): string {
    const tipo = this.tiposProductos.find(t => t.id === id);
    return tipo ? tipo.nombre : '-';
  }

  getNombreCategoriaProducto(id: number): string {
    const categoria = this.categoriasProductos.find(c => c.id === id);
    return categoria ? categoria.nombre : '-';
  }

  abrirModalNuevoProducto() {
    this.mostrarModalNuevo = true;
    this.nuevoProducto = {
      idProducto: 0,
      nombre: '',
      descripcion: '',
      codBarras: '',
      precioCompra: 0,
      precioVenta: 0,
      idTipoProducto: 0,
      idCategoriaProducto: 0
    };
  }

  cerrarModalNuevoProducto() {
    this.mostrarModalNuevo = false;
  }

  guardarNuevoProducto() {
    if (this.nuevoProducto.nombre.trim() && this.nuevoProducto.descripcion.trim() && this.nuevoProducto.codBarras.trim() && this.nuevoProducto.precioCompra > 0 && this.nuevoProducto.precioVenta > 0 && this.nuevoProducto.idTipoProducto > 0 && this.nuevoProducto.idCategoriaProducto > 0) {
      const newId = this.productos.length > 0 ? Math.max(...this.productos.map(p => p.idProducto)) + 1 : 1;
      this.nuevoProducto.idProducto = newId;
      this.productos = [...this.productos, { ...this.nuevoProducto }];
      this.mostrarModalNuevo = false;
      this.nuevoProducto = {
        idProducto: 0,
        nombre: '',
        descripcion: '',
        codBarras: '',
        precioCompra: 0,
        precioVenta: 0,
        idTipoProducto: 0,
        idCategoriaProducto: 0
      };
      console.log('Nuevo producto a guardar:', this.nuevoProducto);
    } else {
      // Optionally add validation feedback
    }
  }

  editarProducto(id: number): void {
    console.log(`Editar producto con ID: ${id}`);
  }

  eliminarProducto(id: number): void {
    console.log(`Eliminar producto con ID: ${id}`);
    this.productos = this.productos.filter(producto => producto.idProducto !== id);
  }
}
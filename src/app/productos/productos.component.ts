import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, ProductoService } from '../services/productos.service';
import { TipoProducto, TipoProductoService } from '../services/tipo-producto.service';
import { Categoria, CategoriaService } from '../services/categoria.service';

@Component({
  selector: 'app-productos',
  standalone: true, // Si es un componente standalone
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  tiposProductos: TipoProducto[] = []; // Para las opciones del select de Tipo de Producto
  categoriasProductos: Categoria[] = []; // Para las opciones del select de Categoría

  mostrarModalNuevo = false;
  mostrarModalEditar = false;

  // Objeto para el nuevo producto (enlace directo con el formulario)
  nuevoProducto: Producto = {
    nombre: '',
    descripcion: '',
    codBarras: '',
    precioCompra: 0,
    precioVenta: 0,
    idTipoProducto: 0, // Default para el select (debe ser un valor válido o "Seleccione...")
    idCategoriaProducto: 0 // Default para el select
  };

  // Objeto para el producto en edición
  productoEditando: Producto | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService, // Inyecta el servicio de TipoProducto
    private categoriaService: CategoriaService // Inyecta el servicio de Categoria
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarTiposProductos(); // Carga los tipos de producto al iniciar el componente
    this.cargarCategorias(); // Carga las categorías al iniciar el componente
  }

  // --- Carga de datos principales y de lookup ---
  cargarProductos(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorMessage = 'No se pudieron cargar los productos. Intenta de nuevo más tarde.';
      }
    });
  }

  cargarTiposProductos(): void {
    this.tipoProductoService.getTiposProducto().subscribe({
      next: (data) => {
        this.tiposProductos = data;
      },
      error: (err) => {
        console.error('Error al cargar tipos de producto para lookup:', err);
        // Podrías mostrar un mensaje de error si esto falla y el formulario lo necesita
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categoriasProductos = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías para lookup:', err);
        // Podrías mostrar un mensaje de error si esto falla y el formulario lo necesita
      }
    });
  }

  // --- Funciones para obtener nombres de lookup (si el backend no los provee en el GET de productos) ---
  // Si tu backend ya incluye nombreTipoProducto y nombreCategoriaProducto en el GET,
  // estas funciones pueden ser eliminadas y usar producto.nombreTipoProducto directamente.
  getNombreTipoProducto(id: number): string {
    const tipo = this.tiposProductos.find(t => t.id === id);
    return tipo ? tipo.nombre : 'Desconocido';
  }

  getNombreCategoriaProducto(id: number): string {
    const categoria = this.categoriasProductos.find(c => c.id === id);
    return categoria ? categoria.nombre : 'Desconocido';
  }

  // --- Funciones para el modal "Agregar Nuevo Producto" ---
  abrirModalNuevoProducto(): void {
    this.mostrarModalNuevo = true;
    this.resetNuevoProducto(); // Limpiar el objeto de nuevo producto
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalNuevoProducto(): void {
    this.mostrarModalNuevo = false;
    this.resetNuevoProducto(); // Opcional: limpiar al cerrar sin guardar
  }

  resetNuevoProducto(): void {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      codBarras: '',
      precioCompra: 0,
      precioVenta: 0,
      idTipoProducto: 0,
      idCategoriaProducto: 0
    };
  }

  guardarNuevoProducto(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones básicas antes de enviar
    if (!this.nuevoProducto.nombre?.trim() ||
        !this.nuevoProducto.descripcion?.trim() ||
        !this.nuevoProducto.codBarras?.trim() ||
        this.nuevoProducto.precioCompra <= 0 ||
        this.nuevoProducto.precioVenta <= 0 ||
        this.nuevoProducto.idTipoProducto === 0 ||
        this.nuevoProducto.idCategoriaProducto === 0) {
      this.errorMessage = 'Por favor, completa todos los campos y asegúrate que los precios sean positivos.';
      return;
    }
    console.log(this.nuevoProducto);

    this.productoService.createProducto(this.nuevoProducto).subscribe({
      next: (response) => {
        this.successMessage = 'Producto creado exitosamente.';
        this.cerrarModalNuevoProducto();
        this.cargarProductos(); // Recargar la lista de productos
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al guardar nuevo producto:', err);
        // Manejo de errores específicos del backend
        if (err.status === 409) {
          this.errorMessage = err.error?.message || 'Error de conflicto al crear el producto (ej. código de barras duplicado o FK inexistente).';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Datos inválidos para crear el producto.';
        } else {
          this.errorMessage = 'Error al crear el producto. Intenta de nuevo más tarde.';
        }
      }
    });
  }

  // --- Funciones para el modal "Editar Producto" ---
  abrirModalEditarProducto(producto: Producto): void {
    this.productoEditando = { ...producto }; // Clonar el objeto para no modificar el original directamente
    this.mostrarModalEditar = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cerrarModalEditarProducto(): void {
    this.mostrarModalEditar = false;
    this.productoEditando = null; // Limpiar el producto en edición
  }

  guardarEditarProducto(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.productoEditando || !this.productoEditando.idProducto) {
      this.errorMessage = 'No hay producto seleccionado para editar.';
      return;
    }

    // Validaciones básicas de campos (igual que para crear)
    if (!this.productoEditando.nombre?.trim() ||
        !this.productoEditando.descripcion?.trim() ||
        !this.productoEditando.codBarras?.trim() ||
        this.productoEditando.precioCompra <= 0 ||
        this.productoEditando.precioVenta <= 0 ||
        this.productoEditando.idTipoProducto === 0 ||
        this.productoEditando.idCategoriaProducto === 0) {
      this.errorMessage = 'Por favor, completa todos los campos y asegúrate que los precios sean positivos.';
      return;
    }

    this.productoService.updateProducto(this.productoEditando.idProducto, this.productoEditando).subscribe({
      next: (response) => {
        this.successMessage = 'Producto actualizado exitosamente.';
        this.cerrarModalEditarProducto();
        this.cargarProductos(); // Recargar la lista de productos
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        if (err.status === 409) {
          this.errorMessage = err.error?.message || 'Error de conflicto al actualizar el producto (ej. código de barras duplicado o FK inexistente).';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Datos inválidos para actualizar el producto.';
        } else if (err.status === 404) {
          this.errorMessage = err.error?.message || 'Producto no encontrado para actualizar.';
        } else {
          this.errorMessage = 'Error al actualizar el producto. Intenta de nuevo más tarde.';
        }
      }
    });
  }

  // --- Función para Eliminar Producto ---
  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      this.errorMessage = '';
      this.successMessage = '';
      this.productoService.deleteProducto(id).subscribe({
        next: (response) => {
          this.successMessage = 'Producto eliminado exitosamente.';
          this.cargarProductos(); // Recargar la lista
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          if (err.status === 409) { // Violación de clave foránea en INVENTARIOS_LZYM
            this.errorMessage = err.error?.message || 'No se puede eliminar este producto porque está asociado a registros de inventario.';
          } else if (err.status === 404) {
            this.errorMessage = err.error?.message || 'Producto no encontrado para eliminar.';
          } else {
            this.errorMessage = err.error?.message || 'Error al eliminar el producto. Intenta de nuevo.';
          }
        }
      });
    }
  }
}
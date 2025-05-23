import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService, ProductoMenosStock } from '../services/reportes.service';

@Component({
  selector: 'app-productos-menos-stock',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './productos-menos-stock.component.html',
  styleUrl: './productos-menos-stock.component.css'
})
export class ProductosMenosStockComponent implements OnInit {
  productosMenosStock: ProductoMenosStock[] = [];
  limiteMostrar: number = 5; // Valor por defecto para el límite de productos
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.cargarProductosMenosStock();
  }

  cargarProductosMenosStock(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.reportesService.getProductosMenosStock(this.limiteMostrar).subscribe({
      next: (data) => {
        this.productosMenosStock = data;
        if (this.productosMenosStock.length === 0) {
          this.successMessage = `No hay productos con stock para mostrar o el límite es muy bajo.`;
        } else {
          this.successMessage = ''; // Limpiar mensaje si hay datos
        }
      },
      error: (err) => {
        console.error('Error al cargar productos con menos stock:', err);
        this.errorMessage = err.error?.message || 'No se pudieron cargar los productos con menor stock. Intenta de nuevo más tarde.';
        this.productosMenosStock = []; // Limpiar la tabla en caso de error
      }
    });
  }
}
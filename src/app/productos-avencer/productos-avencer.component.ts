import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService, ProductoAVencer } from '../services/reportes.service';

@Component({
  selector: 'app-productos-avencer',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './productos-avencer.component.html',
  styleUrl: './productos-avencer.component.css'
})
export class ProductosAvencerComponent implements OnInit {
  productosAVencer: ProductoAVencer[] = [];
  diasParaVencer: number = 30; // Valor por defecto
  errorMessage: string = '';
  successMessage: string = ''; // Aunque aquí no se usa mucho, es buena práctica

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.cargarProductosAVencer();
  }

  cargarProductosAVencer(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.reportesService.getProductosAVencer(this.diasParaVencer).subscribe({
      next: (data) => {
        this.productosAVencer = data;
        if (this.productosAVencer.length === 0) {
          this.successMessage = `No hay productos próximos a vencer en los próximos ${this.diasParaVencer} días.`;
        } else {
          this.successMessage = ''; // Limpiar mensaje si hay datos
        }
      },
      error: (err) => {
        console.error('Error al cargar productos a vencer:', err);
        this.errorMessage = err.error?.message || 'No se pudieron cargar los productos próximos a vencer. Intenta de nuevo más tarde.';
        this.productosAVencer = []; // Limpiar la tabla en caso de error
      }
    });
  }
}
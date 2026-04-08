import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vehiculos.html',
  styleUrls: ['./vehiculos.css']
})
export class VehiculosComponent {

  placa = '';
  tipo = '';
  vehiculos: any[] = [];

  constructor() {
    // 🔄 Cargar datos guardados
    const data = localStorage.getItem('vehiculos');
    if (data) {
      this.vehiculos = JSON.parse(data);
    }
  }

  agregarVehiculo() {
    if (this.placa && this.tipo) {
      this.vehiculos.push({
        placa: this.placa,
        tipo: this.tipo
      });

      this.guardar();

      this.placa = '';
      this.tipo = '';
    }
  }

  eliminarVehiculo(index: number) {
    this.vehiculos.splice(index, 1);
    this.guardar();
  }

  guardar() {
    localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));
  }

}
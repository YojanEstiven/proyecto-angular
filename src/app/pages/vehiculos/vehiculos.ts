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

  agregarVehiculo() {
    if (this.placa && this.tipo) {
      this.vehiculos.push({
        placa: this.placa,
        tipo: this.tipo
      });

      // limpiar campos
      this.placa = '';
      this.tipo = '';
    }
  }

  eliminarVehiculo(index: number) {
    this.vehiculos.splice(index, 1);
  }

}
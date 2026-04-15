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
  editandoIndex: number | null = null;

  constructor() {
    const data = localStorage.getItem('vehiculos');
    if (data) {
      this.vehiculos = JSON.parse(data);
    }
  }
  mensajeError = '';

  guardarVehiculo() {

    if (!this.placa || !this.tipo) {
      this.mensajeError = 'Debe ingresar placa y seleccionar el tipo de vehículo';
      return;
    }

    this.mensajeError = ''; 

    if (this.editandoIndex !== null) {
      this.vehiculos[this.editandoIndex] = {
        placa: this.placa,
        tipo: this.tipo
      };
      this.editandoIndex = null;
    } else {
      this.vehiculos.push({
        placa: this.placa,
        tipo: this.tipo
      });
    }

    localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));
    this.limpiar();

  }

  
  editarVehiculo(index: number) {
    this.editandoIndex = index;
    this.placa = this.vehiculos[index].placa;
    this.tipo = this.vehiculos[index].tipo;
    this.mensajeError = ''; 
  }

  eliminarVehiculo(index: number) {
    this.vehiculos.splice(index, 1);
    localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));
    this.mensajeError = ''; 
  }

  limpiar() {
    this.placa = '';
    this.tipo = '';
    this.mensajeError = '';
    this.editandoIndex = null;
  }
}
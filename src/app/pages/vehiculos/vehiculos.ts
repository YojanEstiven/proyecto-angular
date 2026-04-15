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
  ingresosActivos: any[] = [];
  editandoIndex: number | null = null;
  mensajeError = '';

  constructor() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.vehiculos = JSON.parse(localStorage.getItem('vehiculos') || '[]');
    this.ingresosActivos = JSON.parse(localStorage.getItem('ingresos') || '[]');
  }

  estaParqueado(placa: string): boolean {
    return this.ingresosActivos.some(i => i.placa === placa);
  }

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
      // Evitar placas duplicadas
      if (this.vehiculos.find(v => v.placa === this.placa)) {
        this.mensajeError = 'Esta placa ya está registrada';
        return;
      }
      this.vehiculos.push({
        placa: this.placa,
        tipo: this.tipo
      });
    }

    localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));
    this.limpiar();
    this.cargarDatos(); // Refresh list
  }

  editarVehiculo(index: number) {
    this.editandoIndex = index;
    this.placa = this.vehiculos[index].placa;
    this.tipo = this.vehiculos[index].tipo;
    this.mensajeError = ''; 
  }

  eliminarVehiculo(index: number) {
    const v = this.vehiculos[index];
    if (this.estaParqueado(v.placa)) {
      alert('No puedes eliminar un vehículo que está parqueado actualmente.');
      return;
    }
    
    if (confirm(`¿Estás seguro de eliminar el vehículo ${v.placa}?`)) {
      this.vehiculos.splice(index, 1);
      localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));
      this.cargarDatos();
    }
  }

  limpiar() {
    this.placa = '';
    this.tipo = '';
    this.mensajeError = '';
    this.editandoIndex = null;
  }
}
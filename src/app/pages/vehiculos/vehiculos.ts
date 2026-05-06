import { Component, afterNextRender, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vehiculos.html',
  styleUrls: ['./vehiculos.css']
})
export class VehiculosComponent {

  private storageService = inject(StorageService);
  placa = '';
  tipo = '';
  vehiculos: any[] = [];
  ingresosActivos: any[] = [];
  editandoIndex: number | null = null;
  mensajeError = '';

  constructor() {
    afterNextRender(() => {
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.vehiculos = JSON.parse(this.storageService.getItem('vehiculos') || '[]');
    this.ingresosActivos = JSON.parse(this.storageService.getItem('ingresos') || '[]');
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

    this.storageService.setItem('vehiculos', JSON.stringify(this.vehiculos));
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
      this.storageService.setItem('vehiculos', JSON.stringify(this.vehiculos));
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
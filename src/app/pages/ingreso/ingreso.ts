import { Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ingreso.html',
  styleUrls: ['./ingreso.css']
})
export class IngresoComponent {

  vehiculos: any[] = [];
  ingresos: any[] = [];
  
  // Logic for Searchable Select
  terminoBusqueda = '';
  vehiculoSeleccionado: any = null;
  dropdownAbierto = false;

  constructor(private router: Router, private eRef: ElementRef) {
    const dataVehiculos = localStorage.getItem('vehiculos');
    if (dataVehiculos) {
      this.vehiculos = JSON.parse(dataVehiculos);
    }

    const dataIngresos = localStorage.getItem('ingresos');
    if (dataIngresos) {
      this.ingresos = JSON.parse(dataIngresos);
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownAbierto = false;
    }
  }

  get vehiculosFiltrados() {
    if (!this.terminoBusqueda) return this.vehiculos;
    return this.vehiculos.filter(v => 
      v.placa.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  seleccionarVehiculo(v: any) {
    this.vehiculoSeleccionado = v;
    this.terminoBusqueda = v.placa;
    this.dropdownAbierto = false;
  }

  limpiarSeleccion() {
    this.vehiculoSeleccionado = null;
    this.terminoBusqueda = '';
    this.dropdownAbierto = true;
  }

  registrarIngreso() {
    if (!this.vehiculoSeleccionado) {
      alert('Seleccione un vehículo de la lista');
      return;
    }

    const yaEsta = this.ingresos.find(i => i.placa === this.vehiculoSeleccionado.placa);
    if (yaEsta) {
      alert('Este vehículo ya tiene un ingreso activo.');
      return;
    }

    const ingreso = {
      placa: this.vehiculoSeleccionado.placa,
      tipo: this.vehiculoSeleccionado.tipo,
      horaIngreso: new Date().toISOString() 
    };

    this.ingresos.push(ingreso);
    localStorage.setItem('ingresos', JSON.stringify(this.ingresos));
    this.router.navigate(['/']); 
  }
}
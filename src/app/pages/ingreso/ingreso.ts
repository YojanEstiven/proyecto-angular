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
  capacidadMaxima = 0;

  terminoBusqueda = '';
  vehiculoSeleccionado: any = null;
  dropdownAbierto = false;

  constructor(private router: Router, private eRef: ElementRef) {

    //  cargar vehículos
    const dataVehiculos = localStorage.getItem('vehiculos');
    if (dataVehiculos) {
      this.vehiculos = JSON.parse(dataVehiculos);
    }

    //  cargar ingresos
    const dataIngresos = localStorage.getItem('ingresos');
    if (dataIngresos) {
      this.ingresos = JSON.parse(dataIngresos);
    }

    //  capacidad
    this.capacidadMaxima = JSON.parse(localStorage.getItem('config_capacidad') || '20');
  }

  // cerrar dropdown al hacer click fuera
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownAbierto = false;
    }
  }

  //  filtro búsqueda
  get vehiculosFiltrados() {
    if (!this.terminoBusqueda) return this.vehiculos;

    return this.vehiculos.filter(v =>
      v.placa.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  // seleccionar vehículo
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

  //  REGISTRAR INGRESO (CON MAPA AUTOMÁTICO)
  registrarIngreso() {

    //  parqueadero lleno
    if (this.ingresos.length >= this.capacidadMaxima) {
      alert('Parqueadero lleno');
      return;
    }

    //  no seleccionó vehículo
    if (!this.vehiculoSeleccionado) {
      alert('Seleccione un vehículo de la lista');
      return;
    }

    // ya está dentro
    const yaEsta = this.ingresos.find(
      i => i.placa === this.vehiculoSeleccionado.placa
    );

    if (yaEsta) {
      alert('Este vehículo ya tiene un ingreso activo.');
      return;
    }

    //  cargar espacios
    let espacios = JSON.parse(localStorage.getItem('espacios') || '[]');

    //  buscar espacio libre según tipo
    const espacioLibre = espacios.find(
      (e: any) => e.tipo === this.vehiculoSeleccionado.tipo && !e.ocupado
    );

    //  sin espacio disponible
    if (!espacioLibre) {
      alert('No hay espacios disponibles para ' + this.vehiculoSeleccionado.tipo);
      return;
    }

    //  ocupar espacio
    espacioLibre.ocupado = true;
    espacioLibre.placa = this.vehiculoSeleccionado.placa;

    //  crear ingreso
    const ingreso = {
      placa: this.vehiculoSeleccionado.placa,
      tipo: this.vehiculoSeleccionado.tipo,
      espacio: espacioLibre.id,
      horaIngreso: new Date().toISOString()
    };

    // guardar datos
    this.ingresos.push(ingreso);
    localStorage.setItem('ingresos', JSON.stringify(this.ingresos));
    window.dispatchEvent(new Event('actualizarDashboard'));
    localStorage.setItem('espacios', JSON.stringify(espacios));

    alert(`Vehículo ingresado en el espacio #${espacioLibre.id}`);

    // limpiar selección
    this.limpiarSeleccion();

    // redirigir
    this.router.navigate(['/']);
  }
}
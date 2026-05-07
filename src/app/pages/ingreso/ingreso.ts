import { Component, ElementRef, HostListener, inject, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

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

  private router = inject(Router);
  private eRef = inject(ElementRef);
  private storageService = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      //  cargar vehículos
      const dataVehiculos = this.storageService.getItem('vehiculos');
      if (dataVehiculos) {
        this.vehiculos = JSON.parse(dataVehiculos);
      }

      //  cargar ingresos
      const dataIngresos = this.storageService.getItem('ingresos');
      if (dataIngresos) {
        this.ingresos = JSON.parse(dataIngresos);
      }

      //  capacidad
      this.capacidadMaxima = JSON.parse(this.storageService.getItem('config_capacidad') || '20');
    });
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

  
  const vehiculosDisponibles = this.vehiculos.filter(v =>

    !this.ingresos.some(i => i.placa === v.placa)

  );

  
  if (!this.terminoBusqueda) {
    return vehiculosDisponibles;
  }

  
  return vehiculosDisponibles.filter(v =>
    v.placa.toLowerCase().includes(
      this.terminoBusqueda.toLowerCase()
    )
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

  registrarIngreso() {

  if (!this.vehiculoSeleccionado) {
    alert('Seleccione un vehículo');
    return;
  }

  let ingresos = JSON.parse(localStorage.getItem('ingresos') || '[]');
  let espacios = JSON.parse(localStorage.getItem('espacios') || '[]');

  const yaExiste = ingresos.find((i: any) => i.placa === this.vehiculoSeleccionado.placa);
  if (yaExiste) {
    alert('Este vehículo ya está dentro');
    return;
  }

  const espacioLibre = espacios.find(
    (e: any) => e.tipo === this.vehiculoSeleccionado.tipo && !e.ocupado
  );

  if (!espacioLibre) {
    alert('No hay espacios disponibles para ' + this.vehiculoSeleccionado.tipo);
    return;
  }

  espacioLibre.ocupado = true;
  espacioLibre.placa = this.vehiculoSeleccionado.placa;

  ingresos.push({
    placa: this.vehiculoSeleccionado.placa,
    tipo: this.vehiculoSeleccionado.tipo,
    espacio: espacioLibre.id,
    horaIngreso: new Date().toISOString()
  });

  localStorage.setItem('ingresos', JSON.stringify(ingresos));
  localStorage.setItem('espacios', JSON.stringify(espacios));

  alert(`Vehículo asignado al espacio #${espacioLibre.id}`);

  this.router.navigate(['/']);
  }
}
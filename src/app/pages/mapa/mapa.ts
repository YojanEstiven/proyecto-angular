import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class MapaComponent implements OnInit, DoCheck {

  carros: any[] = [];
  motos: any[] = [];

  capacidadCarros = 10;
  capacidadMotos = 10;

  constructor() {}

  ngOnInit() {
    this.cargarMapa();
  }

  ngDoCheck() {
    this.cargarMapa();
  }

  cargarMapa() {

    this.capacidadCarros = JSON.parse(
      localStorage.getItem('capacidad_carros') || '10'
    );

    this.capacidadMotos = JSON.parse(
      localStorage.getItem('capacidad_motos') || '10'
    );

    let espacios = JSON.parse(
      localStorage.getItem('espacios') || '[]'
    );

    
    const totalNecesario =
      this.capacidadCarros + this.capacidadMotos;

    
    if (espacios.length !== totalNecesario) {

      espacios = [];

      
      for (let i = 1; i <= this.capacidadCarros; i++) {
        espacios.push({
          id: i,
          tipo: 'Carro',
          ocupado: false,
          placa: null
        });
      }

      
      for (let i = 1; i <= this.capacidadMotos; i++) {
        espacios.push({
          id: i,
          tipo: 'Moto',
          ocupado: false,
          placa: null
        });
      }

      localStorage.setItem(
        'espacios',
        JSON.stringify(espacios)
      );
    }

    
    this.carros = espacios.filter(
      (e: any) => e.tipo === 'Carro'
    );

    this.motos = espacios.filter(
      (e: any) => e.tipo === 'Moto'
    );
  }
}
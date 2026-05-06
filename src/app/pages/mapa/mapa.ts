import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class MapaComponent implements OnInit {

  espacios: any[] = [];

  ngOnInit() {
    this.cargarEspacios();
  }

  cargarEspacios() {
    const data = localStorage.getItem('espacios');

    if (data) {
      this.espacios = JSON.parse(data);
    } else {
      this.generarEspacios();
    }
  }

  generarEspacios() {
    this.espacios = [];

    
    for (let i = 1; i <= 10; i++) {
      this.espacios.push({
        id: i,
        tipo: 'Carro',
        ocupado: false,
        placa: null
      });
    }

    
    for (let i = 11; i <= 20; i++) {
      this.espacios.push({
        id: i,
        tipo: 'Moto',
        ocupado: false,
        placa: null
      });
    }

    localStorage.setItem('espacios', JSON.stringify(this.espacios));
  }

  get carros() {
    return this.espacios.filter(e => e.tipo === 'Carro');
  }

  get motos() {
    return this.espacios.filter(e => e.tipo === 'Moto');
  }

}
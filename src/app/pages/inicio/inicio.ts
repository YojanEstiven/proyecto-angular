import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {

  navItems = [
    { label: 'Vehículos', icon: '🚙', iconClass: 'icon-blue', path: '/vehiculos', desc: 'Gestionar flota' },
    { label: 'Ingreso', icon: '📥', iconClass: 'icon-green', path: '/ingreso', desc: 'Control de entrada', badge: 'Disponible' },
    { label: 'Salida', icon: '📤', iconClass: 'icon-red', path: '/salida', desc: 'Control de salida', badge: 'Ocupado' },
    { label: 'Historial', icon: '📅', iconClass: 'icon-yellow', path: '/historial', desc: 'Registros' },
    { label: 'Ajustes', icon: '⚙️', iconClass: 'icon-gray', path: '/configuracion', desc: 'Configuración' },
    { label: 'Mapa', icon: '🗺️', iconClass: 'icon-blue', path: '/mapa', desc: 'Visualizar espacios' }
  ];

  //  CARROS
  carrosOcupados = 0;
  carrosCapacidad = 0;
  carrosDisponibles = 0;

  //  MOTOS
  motosOcupadas = 0;
  motosCapacidad = 0;
  motosDisponibles = 0;

  constructor(private router: Router) {
    this.cargarEstado();
    window.addEventListener('actualizarDashboard', () => {
    this.cargarEstado();
  });

    
  }

   ngOnInit() {
    this.cargarEstado();
  }

  cargarEstado() {

    const espacios = JSON.parse(localStorage.getItem('espacios') || '[]');

    // CARROS
    const carros = espacios.filter((e: any) => e.tipo === 'Carro');
    const carrosOcupados = carros.filter((e: any) => e.ocupado);

    this.carrosCapacidad = carros.length;
    this.carrosOcupados = carrosOcupados.length;
    this.carrosDisponibles = this.carrosCapacidad - this.carrosOcupados;

    //  MOTOS
    const motos = espacios.filter((e: any) => e.tipo === 'Moto');
    const motosOcupadas = motos.filter((e: any) => e.ocupado);

    this.motosCapacidad = motos.length;
    this.motosOcupadas = motosOcupadas.length;
    this.motosDisponibles = this.motosCapacidad - this.motosOcupadas;
  }

  // detectar si está en inicio
  get isHome(): boolean {
    return this.router.url === '/' || this.router.url === '/inicio';
  }

  // cerrar sesión
  logout() {
    localStorage.removeItem('login');
    this.router.navigate(['/login']);
  }

  // navegación
  navigate(path: string) {
    this.router.navigate([path]);
  }

}
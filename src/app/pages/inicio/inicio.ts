import { Component, afterNextRender, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core'; // <-- 1. IMPORTADO AQUÍ
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

import { Navbar } from '../../components/navbar/navbar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {
  usuarioActual: any = {};

  private storageService = inject(StorageService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone); 
  private http = inject(HttpClient);

  navItems = [
    { label: 'Vehículos', icon: '🚙', iconClass: 'icon-blue', path: '/vehiculos', desc: 'Gestionar flota' },
    { label: 'Ingreso', icon: '📥', iconClass: 'icon-green', path: '/ingreso', desc: 'Control de entrada', badge: 'Disponible' },
    { label: 'Salida', icon: '📤', iconClass: 'icon-red', path: '/salida', desc: 'Control de salida', badge: 'Ocupado' },
    { label: 'Historial', icon: '📅', iconClass: 'icon-yellow', path: '/historial', desc: 'Registros' },
    { label: 'Ajustes', icon: '⚙️', iconClass: 'icon-gray', path: '/configuracion', desc: 'Configuración' },
    { label: 'Mapa', icon: '🗺️', iconClass: 'icon-blue', path: '/mapa', desc: 'Visualizar espacios' },
    { label: 'IA Inteligente', desc: 'Asistente inteligente ParkYepz', icon: '🤖', path: '/ia', iconClass: 'card-purple' }
  ];

  // CARROS
  carrosOcupados = 0;
  carrosCapacidad = 0;
  carrosDisponibles = 0;

  // MOTOS
  motosOcupadas = 0;
  motosCapacidad = 0;
  motosDisponibles = 0;

  horaActual = '';
  clima = 'Cargando clima...';
  temperatura = '';

  mensajesIA: string[] = []; 
  mensajeActivoIA: string = ''; 
  private mensajeActualIndex = 0; 

  generarMensajesIA() {
    this.mensajesIA = [];

    const recomendacionesYAnimos = [
      "Ojo: No dé papaya,☠️ cierre bien las puertas",
      "El que no salude al cliente, le toca gastar el tinto.",
      "Respire hondo... hay clientes que de verdad dan dolor de cabeza",
      "Tip de limpieza: 🧽 Dale una pasada al teclado y al lector de barras al iniciar, el polvo los daña.",
      "Piense en la fría del fin de semana 🍺 y verá cómo rinde el tiempo.",
      "El cliente siempre tiene la razón... 📝 bueno, casi siempre.",
      "Huela a salida 🚪. El relevo ya viene en camino, aguante ahí",
      "Consejo⚡:Revise el papel de la impresora 🧾, no se quede en blanco con un cliente.",
      "Consejo⚡: Cualquier anomalía con las barreras 🚧, repórtela en el software.",
      "Consejo⚡: Recuerda: 📊 Al final del turno, genera el reporte antes de vaciar físicamente el cajón de la caja."
    ];

    const alertasCriticas: string[] = [];

    if (this.carrosOcupados >= 8) {
      alertasCriticas.push('🥶Zona de carros casi llena');
    }
    if (this.motosOcupadas >= 8) {
      alertasCriticas.push('👌 Alta demanda de motos');
    }
    if (this.carrosDisponibles <= 2) {
      alertasCriticas.push('🤯 Quedan pocos espacios para carros');
    }
    if (this.motosDisponibles <= 2) {
      alertasCriticas.push('😱 Quedan pocos espacios para motos');
    }

    const hora = new Date().getHours();
    if (hora >= 18) {
      alertasCriticas.push('Ojo al charco 👀: hay horas pico, no se me duerma ⚡');
    }

    // Separación lógica alertas y consejos
    if (alertasCriticas.length > 0) {
      this.mensajesIA = [...alertasCriticas];
    } else {
      this.mensajesIA = [...recomendacionesYAnimos];
    }
  }

  obtenerClima() {
    const apiKey = 'd8b10deb98bd178876253815107ce775';
    // Aseguramos el código de país en minúscula para Popayán, Colombia
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Popayan,co&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Respuesta de OpenWeather:', data);

        if (data && data.weather && data.main) {
          const descripcion = data.weather[0].description;
          const temp = Math.round(data.main.temp);
          
          this.clima = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
          this.temperatura = `${temp}°C`;

          if (descripcion.toLowerCase().includes('lluv')) {
            if (!this.mensajesIA.includes('🌧 Clima lluvioso detectado')) {
              this.mensajesIA.push('🌧 Clima lluvioso detectado');
            }
          }
        } else {
          if (data && data.message) {
            this.clima = `Error: ${data.message}`; 
          } else {
            this.clima = 'Clima no disponible';
          }
        }
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error total en la petición fetch:', err);
        this.clima = 'Error de red';
        this.cdr.detectChanges();
      });
  }

  constructor(private router: Router) {
    this.cargarEstado();
    this.usuarioActual = JSON.parse(
      localStorage.getItem('usuario_actual') || '{}'
    );
  }

  ngOnInit() {
    this.obtenerClima();
    this.actualizarHora();
    this.cargarEstado();
    this.generarMensajesIA();
    
    if (this.mensajesIA.length > 0) {
      this.mensajeActivoIA = this.mensajesIA[0];
      this.mensajeActualIndex = 1;
    }

    setInterval(() => {
      this.ngZone.run(() => {
        this.cargarEstado();      
        this.generarMensajesIA(); 
        
        if (this.mensajesIA.length > 0) {
          if (this.mensajeActualIndex >= this.mensajesIA.length) {
            this.mensajeActualIndex = 0; 
          }
          this.mensajeActivoIA = this.mensajesIA[this.mensajeActualIndex];
          this.mensajeActualIndex++;
        } else {
          this.mensajeActivoIA = 'Flujo normal del parqueadero';
        }

        this.cdr.detectChanges(); 
      });
    }, 10000); 
  }

  cargarEstado() {
    const espacios = JSON.parse(this.storageService.getItem('espacios') || '[]');

    const carros = espacios.filter((e: any) => e.tipo === 'Carro');
    const carrosOcupados = carros.filter((e: any) => e.ocupado);

    this.carrosCapacidad = carros.length;
    this.carrosOcupados = carrosOcupados.length;
    this.carrosDisponibles = this.carrosCapacidad - this.carrosOcupados;

    const motos = espacios.filter((e: any) => e.tipo === 'Moto');
    const motosOcupadas = motos.filter((e: any) => e.ocupado);

    this.motosCapacidad = motos.length;
    this.motosOcupadas = motosOcupadas.length;
    this.motosDisponibles = this.motosCapacidad - this.motosOcupadas;
  }

  get isHome(): boolean {
    return this.router.url === '/' || this.router.url === '/inicio';
  }

  actualizarHora() {
    setInterval(() => {
      const ahora = new Date();
      this.horaActual = ahora.toLocaleTimeString();
      this.cdr.detectChanges(); 
    }, 1000);
  }

  logout() {
    this.storageService.removeItem('login');
    this.router.navigate(['/login']);
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
import { LoginComponent } from './pages/login/login';
import { inicioComponent } from './pages/inicio/inicio';
import { Vehiculos } from './pages/vehiculos/vehiculos';
import { Ingreso } from './pages/ingreso/ingreso';
import { Salida } from './pages/salida/salida';
import { Historial} from './pages/historial/historial';
import { Configuracion } from './pages/configuracion/configuracion';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: inicioComponent },
  { path: 'vehiculos', component: Vehiculos },
  { path: 'ingreso', component: Ingreso },
  { path: 'salida', component: Salida },
  { path: 'historial', component: Historial },
  { path: 'configuracion', component: Configuracion }
];
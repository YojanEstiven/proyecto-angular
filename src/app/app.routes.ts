import { LoginComponent } from './pages/login/login';
import { InicioComponent } from './pages/inicio/inicio';
import { VehiculosComponent } from './pages/vehiculos/vehiculos';
import { IngresoComponent } from './pages/ingreso/ingreso';
import { SalidaComponent } from './pages/salida/salida';
import { HistorialComponent} from './pages/historial/historial';
import { ConfiguracionComponent } from './pages/configuracion/configuracion';
import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: InicioComponent,
    children: [
      { path: 'vehiculos', component: VehiculosComponent },
      { path: 'ingreso', component: IngresoComponent },
      { path: 'salida', component: SalidaComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'configuracion', component: ConfiguracionComponent }
    ]
  }
];
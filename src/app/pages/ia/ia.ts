import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IaService } from '../../services/ia';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './ia.html',
  styleUrls: ['./ia.css']
})
export class IaComponent {
  pregunta = '';
  respuesta = '';
  cargando = false;

  private iaService = inject(IaService);
  private cd = inject(ChangeDetectorRef);

  usarPregunta(texto: string){
    this.pregunta = texto;
    setTimeout(() => {
      this.enviarPregunta();
    }, 100);
  }

  enviarPregunta(){
    if(!this.pregunta.trim()){
      return;
    }

    if(this.cargando){
      return;
    }

    this.cargando = true;
    this.respuesta = '🤖 Consultando IA...';

    const espacios = JSON.parse(localStorage.getItem('espacios') || '[]');
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');

    const formatearFechaHumana = (fechaRaw: string): string => {
      if (!fechaRaw || fechaRaw.includes('No') || fechaRaw.includes('Formato')) {
        return 'No registrada';
      }
      try {
        const fechaObj = new Date(fechaRaw);
        if (isNaN(fechaObj.getTime())) return fechaRaw;

        return fechaObj.toLocaleString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (e) {
        return fechaRaw;
      }
    };

    const celdasOcupadas = espacios.filter((e: any) => e.ocupado || e.estado === 'ocupado');

    let datosParqueaderoTexto = "=== VEHÍCULOS ACTIVOS DENTRO DEL PARQUEADERO ===\n";
    
    if (celdasOcupadas.length === 0) {
      datosParqueaderoTexto += "El parqueadero está vacío en este momento.\n";
    } else {
      celdasOcupadas.forEach((c: any, index: number) => {
        const tipo = c.tipo || 'Vehículo';
        const placa = c.placa || c.placaVehiculo || 'Sin placa';
        
        const registrosDePlaca = historial.filter((h: any) => h.placa === placa || h.placaVehiculo === placa);
        
        let horaIngresoRaw = '';
        if (registrosDePlaca.length > 0) {
          const ultimoRegistro = registrosDePlaca[registrosDePlaca.length - 1];
          horaIngresoRaw = ultimoRegistro.ingreso || ultimoRegistro.fechaIngreso || '';
        }
        
        const horaIngresoLimpia = formatearFechaHumana(horaIngresoRaw);
        const celdaNum = c.celda || c.numero || index + 1;
        
        datosParqueaderoTexto += `- Celda ${celdaNum}: [${tipo}] Placa: ${placa} | INGRESO: ${horaIngresoLimpia}\n`;
      });
    }

    datosParqueaderoTexto += "\n=== HISTORIAL GENERAL DE MOVIMIENTOS ===\n";
    if (historial.length > 0) {
      historial.slice(-10).forEach((h: any) => {
        const entradaLimpia = formatearFechaHumana(h.ingreso || h.fechaIngreso);
        const salidaLimpia = formatearFechaHumana(h.salida || h.fechaSalida);
        datosParqueaderoTexto += `- Placa: ${h.placa} | Entró: ${entradaLimpia} | Salió: ${salidaLimpia || 'Aún adentro'}\n`;
      });
    }

    const promptConContexto = `
      Eres el asistente inteligente oficial del parqueadero ParkYepz.
      Responde a la pregunta del operador basándote en los datos adjuntos. 
      
      CRÍTICO: Las fechas ya han sido pre-formateadas para ti en un formato entendible (DD/MM/AAAA, HH:MM AM/PM). Cuando le respondas al operador, escribe las fechas exactamente en ese formato limpio y legible. Nunca muestres formatos con la letra 'T' o 'Z'.

      ${datosParqueaderoTexto}

      Pregunta del operador: ${this.pregunta}
    `;

    // 6. Enviamos la consulta
    this.iaService
      .preguntarIA(promptConContexto)
      .subscribe({
        next: (resp: any) => {
          try{
            if(
              resp &&
              resp.choices &&
              resp.choices.length > 0
            ){
              this.respuesta = resp.choices[0].message.content;
              this.respuesta = this.respuesta
                .replace(/\*\*/g, '')
                .replace(/\*/g, '•');
            }else{
              this.respuesta = ' La IA no devolvió información.';
            }
          }catch(e){
            console.log(e);
            this.respuesta = ' Error procesando respuesta IA.';
          }
          this.cargando = false;
          this.cd.detectChanges();
        },
        error: (err: any) => {
          console.log(err);
          this.respuesta = ' Error al consultar IA.';
          this.cargando = false;
          this.cd.detectChanges();
        }
      });
  }
}
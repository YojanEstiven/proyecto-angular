import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// 1. Importamos el entorno seguro de Angular
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  
  // 2. Traemos la clave desde el entorno en lugar de escribirla en texto plano
  private apiKey = environment.groqApiKey;

  preguntarIA(pregunta: string) {
    const vehiculos = JSON.parse(localStorage.getItem('vehiculos') || '[]');
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    const usuario = JSON.parse(localStorage.getItem('usuario_actual') || '{}');

    const configuracion = {
      capacidadCarros: localStorage.getItem('capacidad_carros'),
      capacidadMotos: localStorage.getItem('capacidad_motos'),
      tarifaCarro: localStorage.getItem('config_carro'),
      tarifaMoto: localStorage.getItem('config_moto')
    };

    const datosSistema = {
      vehiculos,
      historial,
      usuario,
      configuracion
    };

    const prompt = `
Eres la IA oficial de ParkYepz.

RESPONDE:
- corto
- claro
- organizado
- profesional

NO muestres JSON.

DATOS:
${JSON.stringify(datosSistema).slice(0,1500)}

PREGUNTA:
${pregunta}
`;

    return this.http.post(
      this.apiUrl,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Eres una IA inteligente especializada en parqueaderos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

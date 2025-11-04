import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class MascotasService {
  private ruta = 'src/bd/base.json';

  private leerbd() {
    const datos = fs.readFileSync(this.ruta, 'utf-8');
    return JSON.parse(datos);
  }

  private guardarbd(datos: any) {
    fs.writeFileSync(this.ruta, JSON.stringify(datos, null, 2), 'utf-8');
  }

  getListadoMascotas() {
    const datos = this.leerbd();
    return datos.mascotas;
  }

  getMascotaPorId(id: string) {
    const datos = this.leerbd();
    let mascotaEncontrada = null;

    for (let i = 0; i < datos.mascotas.length; i++) {
      if (datos.mascotas[i].id === id) {
        mascotaEncontrada = datos.mascotas[i];
        break;
      }
    }

    if (mascotaEncontrada === null) {
      return { mensaje: 'Mascota no encontrada' };
    } else {
      return mascotaEncontrada;
    }
  }

  postMascota(nuevaMascota) {
    const datos = this.leerbd();

    let maxId = 0;
    for (let i = 0; i < datos.mascotas.length; i++) {
      const num = parseInt(datos.mascotas[i].id);
      if (num > maxId) maxId = num;
    }

    nuevaMascota.id = (maxId + 1).toString();
    datos.mascotas.push(nuevaMascota);
    this.guardarbd(datos);
    return nuevaMascota;
  }

  putModificarMascota(id: string, datosModificados) {
    const datos = this.leerbd();
    let mascotaIndex = -1;

    for (let i = 0; i < datos.mascotas.length; i++) {
      if (datos.mascotas[i].id === id) {
        mascotaIndex = i;
        break;
      }
    }

    if (mascotaIndex === -1) {
      return { mensaje: 'Mascota no encontrada' };
    }

    for (let propiedad in datosModificados) {
      datos.mascotas[mascotaIndex][propiedad] = datosModificados[propiedad];
    }

    this.guardarbd(datos);
    return { mensaje: 'Mascota modificada correctamente' };
  }

  deleteMascota(id: string) {
    const datos = this.leerbd();
    let indice = -1;

    for (let i = 0; i < datos.mascotas.length; i++) {
      if (datos.mascotas[i].id === id) {
        indice = i;
        break;
      }
    }

    if (indice === -1) {
      return { mensaje: 'Mascota no encontrada' };
    }

    // Eliminar desplazando elementos (sin usar métodos)
    for (let i = indice; i < datos.mascotas.length - 1; i++) {
      datos.mascotas[i] = datos.mascotas[i + 1];
    }

    datos.mascotas.length = datos.mascotas.length - 1;

    this.guardarbd(datos);
    return { mensaje: 'Mascota eliminada correctamente' };
  }
}

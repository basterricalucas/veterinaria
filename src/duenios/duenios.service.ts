import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class DueniosService {
  private ruta = 'src/bd/base.json';

  private leerbd() {
    const datos = fs.readFileSync(this.ruta, 'utf-8');
    return JSON.parse(datos);
  }

  private guardarbd(datos: any[]) {
    fs.writeFileSync(this.ruta, JSON.stringify(datos, null, 2), 'utf-8');
  }

  getListadoDuenios() {
    const datos = this.leerbd();
    return datos.duenios;
  }

  getDuenioPorId(id: string) {
    const datos = this.leerbd();
    let duenioEncontrado = null;

    for (let i = 0; i < datos.duenios.length; i++) {
      if (datos.duenios[i].id === id) {
        duenioEncontrado = datos.duenios[i];
        break;
      }
    }

    if (duenioEncontrado === null) {
      return 'no se encontró dueño';
    } else {
      return duenioEncontrado;
    }
  }

  postDuenio(nuevoDuenio: any) {
    const datos = this.leerbd();
    datos.duenios.push(nuevoDuenio);
    this.guardarbd(datos);
    return nuevoDuenio;
  }
}

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class TurnosService {
  private ruta = 'src/bd/base.json';

  private leerbd() {
    const datos = fs.readFileSync(this.ruta, 'utf-8');
    return JSON.parse(datos);
  }

  private guardarbd(datos: any) {
    fs.writeFileSync(this.ruta, JSON.stringify(datos, null, 2), 'utf-8');
  }

  getListadoTurnos() {
    const datos = this.leerbd();
    return datos.turnos;
  }

  getTurnoPorId(id: string) {
    const datos = this.leerbd();
    let turnoEncontrado = null;

    for (let i = 0; i < datos.turnos.length; i++) {
      if (datos.turnos[i].id === id) {
        turnoEncontrado = datos.turnos[i];
        break;
      }
    }

    if (turnoEncontrado === null) {
      return { mensaje: 'Turno no encontrado' };
    } else {
      return turnoEncontrado;
    }
  }

  postTurno(nuevoTurno: any) {
    const datos = this.leerbd();

    if (!nuevoTurno.mascotaId) {
      return { mensaje: 'Debe indicar la mascota para el turno' };
    }

    let mascotaSeleccionada: any = null;
    for (let i = 0; i < datos.mascotas.length; i++) {
      if (datos.mascotas[i].id === nuevoTurno.mascotaId) {
        mascotaSeleccionada = datos.mascotas[i];
        break;
      }
    }

    if (!mascotaSeleccionada) {
      return { mensaje: 'Mascota no encontrada para el turno' };
    }

    const hoy = new Date();
    const fechaTurno = new Date(nuevoTurno.fecha);
    if (fechaTurno < hoy) {
      return { mensaje: 'No se pueden agendar turnos en fechas pasadas' };
    }

    if (!nuevoTurno.duenioId) {
      nuevoTurno.duenioId = mascotaSeleccionada.duenioId;
    }

    let maxId = 0;
    for (let i = 0; i < datos.turnos.length; i++) {
      const num = parseInt(datos.turnos[i].id);
      if (num > maxId) maxId = num;
    }

    nuevoTurno.id = (maxId + 1).toString();
    datos.turnos.push(nuevoTurno);
    this.guardarbd(datos);
  }

  putModificarTurno(id: string, datosModificados: any) {
    const datos = this.leerbd();
    let turnoIndex = -1;

    for (let i = 0; i < datos.turnos.length; i++) {
      if (datos.turnos[i].id === id) {
        turnoIndex = i;
        break;
      }
    }

    if (turnoIndex === -1) {
      return { mensaje: 'Turno no encontrado' };
    }

    if (datosModificados.fecha) {
      const hoy = new Date();
      const fechaNueva = new Date(datosModificados.fecha);
      if (fechaNueva < hoy) {
        return { mensaje: 'No se pueden modificar turnos a fechas pasadas' };
      }
    }

    if (datosModificados.mascotaId) {
      let mascotaValida: any = null;
      for (let i = 0; i < datos.mascotas.length; i++) {
        if (datos.mascotas[i].id === datosModificados.mascotaId) {
          mascotaValida = datos.mascotas[i];
          break;
        }
      }
      if (!mascotaValida) {
        return { mensaje: 'Mascota no encontrada para el turno' };
      }
      if (!datosModificados.duenioId) {
        datosModificados.duenioId = mascotaValida.duenioId || '';
      }
    }

    for (let propiedad in datosModificados) {
      datos.turnos[turnoIndex][propiedad] = datosModificados[propiedad];
    }

    this.guardarbd(datos);
    return { mensaje: 'Turno modificado correctamente' };
  }

  deleteTurno(id: string) {
    const datos = this.leerbd();
    let indice = -1;

    for (let i = 0; i < datos.turnos.length; i++) {
      if (datos.turnos[i].id === id) {
        indice = i;
        break;
      }
    }

    if (indice === -1) {
      return { mensaje: 'Turno no encontrado' };
    }

    for (let i = indice; i < datos.turnos.length - 1; i++) {
      datos.turnos[i] = datos.turnos[i + 1];
    }

    datos.turnos.length = datos.turnos.length - 1;

    this.guardarbd(datos);
    return { mensaje: 'Turno eliminado correctamente' };
  }
}

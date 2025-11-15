import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class HistorialService {
  private ruta = 'src/bd/base.json';

  private leerbd() {
    const datos = fs.readFileSync(this.ruta, 'utf-8');
    return JSON.parse(datos);
  }

  private guardarbd(datos: any) {
    fs.writeFileSync(this.ruta, JSON.stringify(datos, null, 2), 'utf-8');
  }
  getHistorial() {
    const datos = this.leerbd();
    return datos.tratamientos;
  }
  getHistorialPorMascota(idMascota: string) {
    const datos = this.leerbd();
    const mascotas = datos.mascotas;
    let mascotaSeleccionada = null;
    for (let i = 0; i < datos.mascotas.length; i++) {
      if (datos.mascotas[i].id === idMascota) {
        mascotaSeleccionada = mascotas[i];
        break;
      }
    }
    if (!mascotaSeleccionada) {
      return { mensaje: 'Mascota no encontrada' };
    }
    let duenioMascota = null;
    if (mascotas.duenioId) {
      for (let i = 0; i < datos.duenios.length; i++) {
        if (datos.duenios[i].id === mascotas.duenioId) {
          duenioMascota = datos.duenios[i];
          break;
        }
      }
    }
    const historialMascota: any[] = [];
    for (let i = 0; i < datos.tratamientos.length; i++) {
      const registro = datos.tratamientos[i];
      if (registro.mascotaId === idMascota) {
        historialMascota.push(registro);
      }
    }
    return {
      mascota: mascotaSeleccionada,
      duenio: duenioMascota,
      tratamientos: historialMascota,
    };
  }

  agregarRegistro(nuevoRegistro: any) {
    const datos = this.leerbd();
    if (!nuevoRegistro || !nuevoRegistro.mascotaId) {
      return { mensaje: 'Debe indicar la mascota del registro' };
    }

    let mascotaExiste = false;
    for (let i = 0; i < datos.mascotas.length; i++) {
      if (datos.mascotas[i].id === nuevoRegistro.mascotaId) {
        mascotaExiste = true;
        break;
      }
    }

    if (!mascotaExiste) {
      return {
        mensaje: `La mascota con id ${nuevoRegistro.mascotaId} no existe`,
      };
    }

    if (!nuevoRegistro.fecha || !nuevoRegistro.tipo) {
      return { mensaje: 'Debe indicar fecha y tipo del tratamiento' };
    }

    const fechaRegistro = new Date(nuevoRegistro.fecha);
    const hoy = new Date();
    if (fechaRegistro > hoy) {
      return { mensaje: 'No se puede registrar historial en el futuro' };
    }

    let maxId = 0;
    for (let i = 0; i < datos.tratamientos.length; i++) {
      const numero = parseInt(datos.tratamientos[i].id);
      if (!isNaN(numero) && numero > maxId) {
        maxId = numero;
      }
    }

    const registro = {
      id: (maxId + 1).toString(),
      mascotaId: nuevoRegistro.mascotaId,
      fecha: nuevoRegistro.fecha,
      tipo: nuevoRegistro.tipo,
      detalle: nuevoRegistro.detalle || nuevoRegistro.descripcion || '',
      vacunaNombre: nuevoRegistro.vacunaNombre || '',
    };

    datos.tratamientos.push(registro);
    this.guardarbd(datos);
    return { mensaje: 'Registro agregado', registro };
  }

  getChequeoAnual() {
    const datos = this.leerbd();
    const fechaActual = new Date();
    const resultado: any[] = [];

    const ultimoChequeoPorMascota: any = {};
    for (let i = 0; i < datos.tratamientos.length; i++) {
      const registro = datos.tratamientos[i];
      if (registro.tipo === 'control' && registro.mascotaId) {
        if (!ultimoChequeoPorMascota[registro.mascotaId]) {
          ultimoChequeoPorMascota[registro.mascotaId] = registro;
        } else {
          const fechaNueva = new Date(registro.fecha);
          const fechaVieja = new Date(
            ultimoChequeoPorMascota[registro.mascotaId].fecha,
          );
          if (fechaNueva > fechaVieja) {
            ultimoChequeoPorMascota[registro.mascotaId] = registro;
          }
        }
      }
    }

    for (let i = 0; i < datos.mascotas.length; i++) {
      const mascota = datos.mascotas[i];
      const ultimoChequeo = ultimoChequeoPorMascota[mascota.id];
      let necesitaChequeo = false;

      if (!ultimoChequeo) {
        necesitaChequeo = true;
      } else {
        const fechaUltimo = new Date(ultimoChequeo.fecha);
        const diferencia = fechaActual.getTime() - fechaUltimo.getTime();
        const dias = diferencia / (1000 * 60 * 60 * 24);
        if (dias >= 365) {
          necesitaChequeo = true;
        }
      }

      if (necesitaChequeo) {
        let nombreDuenio = '';
        if (mascota.duenioId) {
          for (let j = 0; j < datos.duenios.length; j++) {
            const duenio = datos.duenios[j];
            if (duenio.id === mascota.duenioId) {
              nombreDuenio = duenio.nombre;
              break;
            }
          }
        }

        let fechaUltimoChequeo = '';
        if (ultimoChequeo && ultimoChequeo.fecha) {
          fechaUltimoChequeo = ultimoChequeo.fecha;
        }

        resultado.push({
          idMascota: mascota.id,
          nombreMascota: mascota.nombre,
          duenioId: mascota.duenioId,
          nombreDuenio: nombreDuenio,
          ultimoChequeo: fechaUltimoChequeo,
        });
      }
    }

    return resultado;
  }
  getVacunasPendientes() {
    const datos = this.leerbd();
    const fechaActual = new Date();
    const resultado: any[] = [];

    const ultimaVacunaPorMascota: any = {};
    for (let i = 0; i < datos.tratamientos.length; i++) {
      const registro = datos.tratamientos[i];
      if (registro.tipo === 'vacuna' && registro.mascotaId) {
        if (!ultimaVacunaPorMascota[registro.mascotaId]) {
          ultimaVacunaPorMascota[registro.mascotaId] = registro;
        } else {
          const fechaNueva = new Date(registro.fecha);
          const fechaVieja = new Date(
            ultimaVacunaPorMascota[registro.mascotaId].fecha,
          );
          if (fechaNueva > fechaVieja) {
            ultimaVacunaPorMascota[registro.mascotaId] = registro;
          }
        }
      }
    }

    for (let i = 0; i < datos.mascotas.length; i++) {
      const mascota = datos.mascotas[i];
      const ultimaVacuna = ultimaVacunaPorMascota[mascota.id];
      let necesitaVacuna = false;

      if (!ultimaVacuna) {
        necesitaVacuna = true;
      } else {
        const fechaUltima = new Date(ultimaVacuna.fecha);
        const diferenciaVacuna = fechaActual.getTime() - fechaUltima.getTime();
        const diasVacuna = diferenciaVacuna / (1000 * 60 * 60 * 24);
        if (diasVacuna >= 365) {
          necesitaVacuna = true;
        }
      }

      if (necesitaVacuna) {
        let nombreDuenio = '';
        if (mascota.duenioId) {
          for (let j = 0; j < datos.duenios.length; j++) {
            const duenio = datos.duenios[j];
            if (duenio.id === mascota.duenioId) {
              nombreDuenio = duenio.nombre;
              break;
            }
          }
        }

        let fechaUltimaVacuna = '';
        if (ultimaVacuna && ultimaVacuna.fecha) {
          fechaUltimaVacuna = ultimaVacuna.fecha;
        }

        resultado.push({
          idMascota: mascota.id,
          nombreMascota: mascota.nombre,
          duenioId: mascota.duenioId,
          nombreDuenio: nombreDuenio,
          ultimaVacuna: fechaUltimaVacuna,
        });
      }
    }

    return resultado;
  }
}

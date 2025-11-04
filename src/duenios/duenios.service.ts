import { Injectable,} from '@nestjs/common';
import * as fs from 'fs';
import { get } from 'http';

@Injectable()
export class DueniosService {
    private ruta = "src/bd/base.json";

    private leerbd(){
        const datos = fs.readFileSync(this.ruta, 'utf-8');
        return JSON.parse(datos);    
    }

    private guardarbd(datos: any[]){
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
    return "no se encontró dueño";
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

putmodificarDuenio(id: string, datosModificados: any) {
  const datos = this.leerbd();
  let duenioIndex = -1;

  for (let i = 0; i < datos.duenios.length; i++) {
    if (datos.duenios[i].id === id) {
      duenioIndex = i;
      break; 
    }
  }

  if (duenioIndex === -1) {
    return "no se encontró dueño"; 
  }

  for (let propiedad in datosModificados) {
    datos.duenios[duenioIndex][propiedad] = datosModificados[propiedad];
  }

  this.guardarbd(datos);
  return "Dueño modificado";
}
deleteDuenio(id: string) {
  const datos = this.leerbd();
  let indice = -1;

  for (let i = 0; i < datos.duenios.length; i++) {
    if (datos.duenios[i].id === id) {
      indice = i;
      break;
    }
  }

  if (indice === -1) {
    return "no se encontró dueño";
  }

  for (let i = indice; i < datos.duenios.length - 1; i++) {
    datos.duenios[i] = datos.duenios[i + 1];
  }

  datos.duenios.length = datos.duenios.length - 1;

  this.guardarbd(datos);
  return "Dueño eliminado";
}

}


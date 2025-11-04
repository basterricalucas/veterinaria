import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TurnosService } from './turnos.service';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get('listado')
  getListadoTurnos() {
    return this.turnosService.getListadoTurnos();
  }

  @Get('turno/:id')
  getTurnoPorId(@Param('id') id: string) {
    return this.turnosService.getTurnoPorId(id);
  }

  @Post('nuevo')
  postTurno(@Body() nuevoTurno) {
    return this.turnosService.postTurno(nuevoTurno);
  }

  @Put('modificar/:id')
  putModificarTurno(@Param('id') id: string, @Body() datosModificados) {
    return this.turnosService.putModificarTurno(id, datosModificados);
  }

  @Delete('eliminar/:id')
  deleteTurno(@Param('id') id: string) {
    return this.turnosService.deleteTurno(id);
  }
}

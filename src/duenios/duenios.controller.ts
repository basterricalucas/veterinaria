import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { DueniosService } from './duenios.service';

@Controller('duenios')
export class DueniosController {
  constructor(private readonly dueniosService: DueniosService) {}

  @Get('listado')
  getListadoDuenios() {
    return this.dueniosService.getListadoDuenios();
  }

  @Get('duenio/:id')
  getDuenioPorId(@Param('id') id: string) {
    return this.dueniosService.getDuenioPorId(id);
  }

  @Post('nuevo')
  postDuenio(@Body() nuevoDuenio: any ) {
    return this.dueniosService.postDuenio(nuevoDuenio);
  }
}

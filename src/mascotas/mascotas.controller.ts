import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MascotasService } from './mascotas.service';

@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Get('listado')
  getListadoMascotas() {
    return this.mascotasService.getListadoMascotas();
  }

  @Get('mascota/:id')
  getMascotaPorId(@Param('id') id: string) {
    return this.mascotasService.getMascotaPorId(id);
  }

  @Post('nuevo')
  postMascota(@Body() nuevaMascota: any ) {
    return this.mascotasService.postMascota(nuevaMascota);
  }

  @Put('modificar/:id')
  putModificarMascota(@Param('id') id: string, @Body() datosModificados: any) {
    return this.mascotasService.putModificarMascota(id, datosModificados);
  }

  @Delete('eliminar/:id')
  deleteMascota(@Param('id') id: string) {
    return this.mascotasService.deleteMascota(id);
  }
}

import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { HistorialService } from './historial.service';

@Controller('historial')
export class HistorialController {
    constructor(private readonly historialService: HistorialService) {}

    @Get('lista')
    getHistorial() {
        return this.historialService.getHistorial();
    }
    @Get('mascota/:id')
    getHistorialPorId(@Param('id') id: string) {
        return this.historialService.getHistorialPorMascota(id);
    }
    @Get('chequeos/pendientes')
    getChequeosPendientes() {
        return this.historialService.getChequeoAnual();
    }
    @Get('vacunas/pendientes')
    getVacunasPendientes() {
        return this.historialService.getVacunasPendientes();
    }
    @Post('nuevo')
    postHistorial(@Body() nuevoRegistro: any) {
        return this.historialService.agregarRegistro(nuevoRegistro);
    }
}

import { Module } from '@nestjs/common';
import { DueniosModule } from './duenios/duenios.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { TurnosModule } from './turnos/turnos.module';
import { HistorialService } from './historial/historial.service';
import { HistorialController } from './historial/historial.controller';
import { HistorialModule } from './historial/historial.module';

@Module({
  imports: [DueniosModule, MascotasModule, TurnosModule, HistorialModule],
  providers: [HistorialService],
  controllers: [HistorialController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { DueniosModule } from './duenios/duenios.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { TurnosModule } from './turnos/turnos.module';

@Module({
  imports: [DueniosModule, MascotasModule, TurnosModule],
})
export class AppModule {}

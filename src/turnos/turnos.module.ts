import { Module } from '@nestjs/common';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

@Module({
  controllers: [TurnosController],
  providers: [TurnosService],
})
export class TurnosModule {
  id: string;
  mascotaId: string;
  duenioId: string;
  fecha: string;
  hora: string;
  motivo: string;
}

import { Module } from '@nestjs/common';
import { DueniosController } from './duenios.controller';
import { DueniosService } from './duenios.service';

@Module({
  controllers: [DueniosController],
  providers: [DueniosService],
})
export class DueniosModule {
  id: string;
  nombre: string
  telefono: string;
  direccion: string;
}

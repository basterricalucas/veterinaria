import { Module } from '@nestjs/common';

@Module({})
export class HistorialModule {
    id: string;
    tipo: string;
    detalle: string;
    fecha: string;
    mascotaId: string;
}

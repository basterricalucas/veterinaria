import { Test, TestingModule } from '@nestjs/testing';
import { DueniosController } from './duenios.controller';

describe('DueñosController', () => {
  let controller: DueniosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DueniosController],
    }).compile();

    controller = module.get<DueniosController>(DueniosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

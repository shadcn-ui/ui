import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TelegramService } from '../telegram/telegram.service';

describe('AdminController', () => {
  let controller: AdminController;
  const mockAdminService = { getMonitoring: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        { provide: TelegramService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return monitoring data', async () => {
    const result = [{ id: 1, name: 'PC', status: 'online' }];
    mockAdminService.getMonitoring.mockResolvedValue(result);
    await expect(controller.getMonitoring()).resolves.toEqual(result);
  });
});

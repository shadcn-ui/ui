import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    updateUserById: jest.fn(),
    findById: jest.fn(),
    findBySnils: jest.fn(),
    updateUser: jest.fn(),
    deleteUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    mockUsersService.getAllUsers.mockResolvedValueOnce([{ id: 1, firstName: 'Иван' }]);
    expect(await controller.getAll()).toEqual([{ id: 1, firstName: 'Иван' }]);
  });
});

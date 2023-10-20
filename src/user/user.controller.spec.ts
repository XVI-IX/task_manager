import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    userController = new UserController(userService);
  });

  describe('profile', () => {
    it('Should return a JSON object containing user info', async () => {
      const result = {
        user: 'mock user',
        tasks: ["mock task"]
      };
      jest.spyOn(userService, 'profile').mockImplementation(() => result);

      expect(await userController.getProfile()).toBe(result);
    })
  })
});
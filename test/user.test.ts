import { prismaMock } from './singleton';
import { userService } from '../src/service';

test('should create new user ', async () => {
    const user:any = {
    //   id: 1,
      name: 'Rich',
      email: 'hello@prisma.io',
    //   acceptTermsAndConditions: true,
    }
    
    prismaMock.user.create.mockResolvedValue(user);
  
    await expect(userService.createUser(user)).resolves.toEqual({
    //   id: 1,
      name: 'Rich',
      email: 'hello@prisma.io',
    //   acceptTermsAndConditions: true,
    })
  })
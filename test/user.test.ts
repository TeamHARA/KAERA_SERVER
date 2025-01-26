import { prismaMock } from './singleton';
import { userService } from '../src/service';
import { userCreateDTO } from '../src/interfaces/DTO/userDTO';


test('should create new user ', async () => {
    
    const newUser:userCreateDTO = {
      name: 'Rich',
      email: 'hello@prisma.io',
      kakaoId: 2020200,
      appleId: "apple_id",
      ageRange: "20~29",
      gender: "male",
      refreshToken: "refresh_token",
      deviceToken: "device_token",
    }
    
    const createdNewUser = {
      id:1,
      ...newUser,
      used_template:[1,2],
      created_at: new Date(),
      updated_at: new Date(),
      kakao_id: BigInt(2020200),
      apple_id: "apple_id",
      age_range: "20~29",
      gender: "male"
    }
    // prisma 의 create 함수가 어떤 값을 반환할지를 mockResolvedValue() 함수로 정의
    prismaMock.user.create.mockResolvedValue(createdNewUser);
  
    await expect(userService.createUser(newUser)).resolves.toEqual(createdNewUser);
      
  })
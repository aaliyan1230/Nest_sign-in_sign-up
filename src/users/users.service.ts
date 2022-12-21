import { Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { toUserDto } from 'src/shared/mapper/toUserdto';
import { UserDto } from './dto/Userdto';
import { LoginUserDto } from './dto/LoginUserdto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { CreateUserDto } from './dto/CreateUserdto';
import { comparePasswords } from 'src/shared/utils';
import { UpdateUserDto } from './dto/UpdateUserdto';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}


  async findOne(username: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({ where: { username } });
    return toUserDto(user);
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ username }: any): Promise<UserDto> {
    return await this.findOne(username);
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { username, password, email } = userDto;
    // console.log('userdto', userDto)

    // check if the user exists in the db
    const userInDb = await this.userRepo.findOne({ where: { username } });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.userRepo.create({
      username,
      password,
      email,
    });

    await this.userRepo.save(user);

    return toUserDto(user);
  }

  async update(id:string, userDto: UpdateUserDto): Promise<UserDto> {
    // const { username, password, email } = userDto;
    // console.log('userdto', userDto)
  //   let updatedUser={};
  //  if(username!==undefined){
  //   updatedUser={...updatedUser, username};
  //  }
  //  if(email!==undefined){
  //   updatedUser={...updatedUser, email};
  //  }
  //  if(password!==undefined){
  //   updatedUser={...updatedUser, password};
  //  }
   

    // check if the user exists in the db

    const userInDb = await this.userRepo.findOne({ where: { id } });



    if (!userInDb) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const user= await this.userRepo.update(id, userDto);

    if(user){
     const Updated= await this.userRepo.findOne({ where: { id } });

      return toUserDto(Updated);
    }

    // return toUserDto(user);
  }


  async delete(id:string): Promise<UserDto>{
    //error handling to be done
    const user = await this.userRepo.findOne({ where: { id } });

    if(user){
      const deleted = await this.userRepo.remove(user);
      return toUserDto(deleted);
    }else{
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

  }

  private _sanitizeUser(user: UserEntity) {
    delete user.password;
    return user;
  }



  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  // ];

//   findAll(): Promise<User[]> {
//     return this.userRepo.find();
//   }

//   findOne(username: string): Promise<User | undefined> {
//     return this.userRepo.findOneBy({username});
//   }

//   async remove(id: string): Promise<void> {
//     await this.usersRepository.delete(id);
//   }

//   async findOne(username: string): Promise<User | undefined> {
//     return this.users.find((user) => user.username === username);
//   }
}

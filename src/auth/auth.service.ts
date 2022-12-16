import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/Userdto';
import { CreateUserDto } from 'src/users/dto/CreateUserdto';
import { LoginUserDto } from 'src/users/dto/LoginUserdto';
import { JwtPayload } from './interfaces/payload.interface';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { RegistrationStatus } from './interfaces/RegistrationStatus.interface';
import { LoginStatus } from './interfaces/login-status.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}

//       async register(){

//       }

// // for local authentication
//     async validateUser(username: string, pass: string): Promise<any>{
//         const user=await this.usersService.findOne(username);
//         const validity = await bcrypt.compare(pass, user.password);
//         if (user &&  validity){
//             const {password, ...result}=user;
//             return result;
//         }
//         return null;
//     }

//     async login(user: any){
//         const payload = {username: user.username, sub: user.userId};
//         return {
//             access_token: this.jwtService.sign(payload),
//         };
//     }
async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.usersService.create(userDto);
      // console.log(user);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.usersService.findByLogin(loginUserDto);

    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ username }: UserDto): any {
    // const expiresIn = process.env.EXPIRESIN;
    const expiresIn = '1d';

    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}

import {
    Controller,
    Body,
    Post,
    HttpException,
    HttpStatus,
    Get,
    Req,
    UseGuards,
    Param,
    Patch,
    Delete
  } from '@nestjs/common';
  import { CreateUserDto } from 'src/users/dto/CreateUserdto';
  import { RegistrationStatus } from './interfaces/RegistrationStatus.interface';
  import { AuthService } from './auth.service';
  import { LoginStatus } from './interfaces/login-status.interface';
  import { LoginUserDto } from 'src/users/dto/LoginUserdto';
  import { JwtPayload } from './interfaces/payload.interface';
  import { JwtAuthGuard } from './jwt-auth.guard';
  import { UpdateUserDto } from 'src/users/dto/UpdateUserdto';
import { DeleteResult, ObjectID } from 'typeorm';
import { UserDto } from 'src/users/dto/Userdto';
import { Res } from '@nestjs/common/decorators';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    public async register(
      @Body() createUserDto: CreateUserDto,
    ): Promise<RegistrationStatus> {
      console.log('creuserdto', createUserDto);
      const result: RegistrationStatus = await this.authService.register(
        createUserDto,
      );
      console.log('result', result);
  
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST, {cause: new Error(result.message)});
      }
  
      return result;
    }
  
    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true})response): Promise<LoginStatus> {
      const result = await this.authService.login(loginUserDto);
      const {accessToken, ...rest} = result;
      response.cookie('jwt', accessToken, {httpOnly: true});

      return result;
    }
  
    @Get('whoami')
    @UseGuards(JwtAuthGuard)
    public async testAuth(@Req() req: any): Promise<JwtPayload> {
      
      return req.user;
      // return req.user.id!==null?req.user:{message:"user not"};
    }

    

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    public async updateAuth(@Param('id') id: ObjectID, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {

      return this.authService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    public async deleteAuth(@Param('id') id: ObjectID): Promise<DeleteResult>{
      return this.authService.deleteUser(id);
    }
  }
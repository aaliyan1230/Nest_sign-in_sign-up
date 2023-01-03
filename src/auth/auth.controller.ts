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
import { request } from 'http';
  
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
  
    @Get('logout')
    @UseGuards(JwtAuthGuard)
    public async logout(@Res({passthrough: true})response) {

      response.cookie('jwt', "", {httpOnly: true});

      return {message: "User logged out"};
    }
  
    @Get('whoami')
    @UseGuards(JwtAuthGuard)
    public async testAuth(@Req() req: any) {
      
      return req.user;
      // return req.user.id!==null?req.user:{message:"user not"};
    }

    

    @Patch('update')
    @UseGuards(JwtAuthGuard)
    public async updateAuth(@Req() req: any ,@Body() updateUserDto: UpdateUserDto): Promise<UserDto> {

      return this.authService.updateUser(req.user.username, updateUserDto);
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    public async deleteAuth(@Req() req: any ): Promise<DeleteResult>{
      return this.authService.deleteUser(req.user.username);
    }
  }
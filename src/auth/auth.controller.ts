import {
    Controller,
    Body,
    Post,
    HttpException,
    HttpStatus,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { CreateUserDto } from 'src/users/dto/CreateUserdto';
  import { RegistrationStatus } from './interfaces/RegistrationStatus.interface';
  import { AuthService } from './auth.service';
  import { LoginStatus } from './interfaces/login-status.interface';
  import { LoginUserDto } from 'src/users/dto/LoginUserdto';
  import { JwtPayload } from './interfaces/payload.interface';
  import { JwtAuthGuard } from './jwt-auth.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    public async register(
      @Body() createUserDto: CreateUserDto,
    ): Promise<RegistrationStatus> {
      const result: RegistrationStatus = await this.authService.register(
        createUserDto,
      );
  
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }
  
      return result;
    }
  
    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
      return await this.authService.login(loginUserDto);
    }
  
    @Get('whoami')
    @UseGuards(JwtAuthGuard)
    public async testAuth(@Req() req: any): Promise<JwtPayload> {
      return req.user;
    }
  }
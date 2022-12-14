import {IsNotEmpty, IsEmail, IsOptional, isNotEmpty} from 'class-validator';

export class UpdateUserDto {  
    @IsOptional() @IsNotEmpty() password: string;
    @IsOptional() @IsNotEmpty() @IsEmail()  email: string;
}
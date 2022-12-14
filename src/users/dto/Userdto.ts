import {IsNotEmpty, IsEmail} from 'class-validator';
import { ObjectID } from 'typeorm';

export class UserDto {  
    @IsNotEmpty()  username: string;
    // @IsNotEmpty()  password: string;
    @IsNotEmpty()  @IsEmail()  email: string;
    createdOn?:Date;
}

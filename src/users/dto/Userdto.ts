import {IsNotEmpty, IsEmail} from 'class-validator';

export class UserDto {  
    @IsNotEmpty()  id: string;
    @IsNotEmpty()  username: string;
    // @IsNotEmpty()  password: string;
    @IsNotEmpty()  @IsEmail()  email: string;
    createdOn?:Date;
}

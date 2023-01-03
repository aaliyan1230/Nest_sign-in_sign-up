import { UserEntity } from "src/users/entity/user.entity";
import { UserDto } from "src/users/dto/Userdto";

export const toUserDto = (data: UserEntity): UserDto => {  
    const { username, email } = data;
    let userDto: UserDto = { username, email };
    return userDto;
};

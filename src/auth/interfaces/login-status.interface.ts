import { UserDto } from "src/users/dto/Userdto";

export interface LoginStatus {
  username: string;
  accessToken: any;
  expiresIn: any;
}
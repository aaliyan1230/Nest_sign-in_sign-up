import { ObjectID } from "typeorm";

export interface JwtPayload {
    username: string;
    email: string;
  }
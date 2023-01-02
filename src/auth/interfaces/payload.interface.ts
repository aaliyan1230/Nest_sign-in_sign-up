import { ObjectID } from "typeorm";

export interface JwtPayload {
    id:ObjectID;
    username: string;
    email: string;
  }
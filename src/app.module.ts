import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [AuthModule, UsersModule,  TypeOrmModule.forRoot({
    type: 'mongodb',
    url: 'mongodb+srv://root:UOkxG8RYAzFpNEny@cluster0.uk1zp.mongodb.net/?retryWrites=true&w=majority',
    database:'Authapp',
    entities: [
      __dirname + '/**/*.entity{.ts,.js}',
    ],
    ssl: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  }),],
// @Module({
//   imports: [AuthModule, UsersModule,  TypeOrmModule.forRoot({
//     type: 'mysql',
//     host: 'localhost',
//     port: 3306,
//     username: 'root',
//     password: 'password',
//     database: 'Auth',
//     entities: [UserEntity],
//     synchronize: true,
//   }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {};

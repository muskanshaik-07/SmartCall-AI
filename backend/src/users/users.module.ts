import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: 'smartcall-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}
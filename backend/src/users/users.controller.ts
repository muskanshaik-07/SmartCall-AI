import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Post(':id/make-admin')
  makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdmin(Number(id));
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(
      loginUserDto.email,
      loginUserDto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
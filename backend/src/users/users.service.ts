import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    const users = await this.userRepository.find();

    return users.map(({ password, ...user }) => user);
  }
  async makeAdmin(id: number) {
    await this.userRepository.update(id, {
      role: 'admin',
    });

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'admin',
    });

    return this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      return null;
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: token,
    };
  }
}
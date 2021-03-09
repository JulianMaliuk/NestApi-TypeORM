import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async getAuthenticatedUser(username: string, password: string) {
    try {
      const user = await this.usersService.findUserForAuth(username);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return isPasswordMatching;
  }

  async validateUser(username: string): Promise<User> {
    const user = await this.usersService.findUserForAuth(username);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(user: User) {
    const { id, username, roles } = user;
    return {
      access_token: this.jwtService.sign({ id, username, roles }),
      user,
    };
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new HttpException('User NOT found', HttpStatus.UNAUTHORIZED);
    }

    const { email, firstName, lastName } = req.user;
    let user = await this.usersService.findOneByUsername(email);
    if (!user) {
      user = await this.usersService.create({
        name: `${firstName} ${lastName}`,
        username: email,
        password: null,
      });
    }

    const { id, username, roles } = user;
    return {
      access_token: this.jwtService.sign({ id, username, roles }),
      user,
    };
  }
}

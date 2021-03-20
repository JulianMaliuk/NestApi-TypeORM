import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
  Get,
  Res,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { UserCreateDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserChangePasswordDto } from '../users/dto/change-password.dto';
import { User } from '../users/entities/user.entity';
import { UserLoginDto } from '../users/dto/login-user.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import { UserUpdateDto } from '../users/dto/update-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(req.user);
    res.cookie('access_token', result.access_token);
    return result;
  }

  @Post('registration')
  async register(@Body() userCreateDto: UserCreateDto) {
    const user = await this.usersService.findUserForAuth(
      userCreateDto.username,
    );
    if (!!user) throw new ConflictException(`Email already exists!`);
    return this.usersService.create(userCreateDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(req.user);
    res.cookie('access_token', result.access_token);
    return result;
  }

  @Post('changePassword')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async changePassword(
    @Req() request: any,
    @Body() { current_password, new_password }: UserChangePasswordDto,
  ) {
    const { username, id } = request.user;
    const user: User = await this.usersService.findUserForAuth(username);
    const isMatch = await this.authService.verifyPassword(
      current_password,
      user.password,
    );
    if (isMatch) {
      user.password = new_password;
      user.hashPassword();
      return this.usersService.update(id, user);
    }
    return new UnauthorizedException();
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      success: true,
    };
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Req() req, @Body() userUpdateDto: UserUpdateDto) {
    return this.usersService.update(req.user.id, userUpdateDto);
  }
}

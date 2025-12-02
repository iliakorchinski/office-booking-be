import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already taken');
    }

    const user = await this.users.createUser(email, password);
    const tokens = this.generateTokens(user);
    await this.users.setRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const tokens = this.generateTokens(user);
    await this.users.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  generateTokens(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = this.jwt.sign(payload, { expiresIn: '15s' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '1m' });

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.users.findById(userId);
    if (!user || user.refreshToken !== rt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(user);
    await this.users.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}

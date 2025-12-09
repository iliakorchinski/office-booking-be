import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/types/common';

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private jwt: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    surname: string,
  ) {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already taken');
    }

    const user = await this.users.createUser(email, password, name, surname);
    const tokens = this.generateTokens(user);
    await this.users.setRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        surname: user.surname,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const tokens = this.generateTokens(user);
    await this.users.setRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        surname: user.surname,
      },
    };
  }

  generateTokens(user: { id: number; email: string; role: Role }) {
    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.users.findById(userId);
    if (!user || user.refreshToken !== rt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(user);

    return tokens;
  }
}

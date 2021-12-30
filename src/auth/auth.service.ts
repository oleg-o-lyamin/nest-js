import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/users.entity';
import { compare } from 'src/utils/crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<UsersEntity | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string) {
    if (token)
      return this.jwtService.verify(token);
    else
      return null;
  }
}

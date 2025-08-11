// 인증 로직 처리 (비밀번호 검증, 세션 관리 등)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** 사용자 검증 (아이디, 비밀번호) */
  async validateUser(userid: string, password: string) {
    const user = await this.usersService.findByUserId(userid);
    if (!user) {
      return null;
    }
    // TODO: 실제 환경에서는 bcrypt 등 해시 검증 필요
    if (user.password !== password) {
      return null;
    }
    return user;
  }

  /** JWT 로그인 토큰 발급 */
  async login(user: any) {
    const payload = { userid: user.userid, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /** OAuth 로그인 시 DB에 없으면 생성, 있으면 리턴 */
  async validateOrCreateOAuthUser(data: {
    userid: string;
    name: string;
    email: string;
  }) {
    let user = await this.usersService.findByUserId(data.userid);
    if (!user) {
      user = await this.usersService.createUser({
        userid: data.userid,
        name: data.name,
        password: Math.random().toString(36).slice(-8), // 임시 비밀번호 생성
        email: data.email,
      });
    }
    return user;
  }
}

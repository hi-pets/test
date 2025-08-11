import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import axios from 'axios';

// 로그인 요청 DTO
class LoginDto {
  userid: string;
  password: string;
}

// 회원가입 요청 DTO
class RegisterDto {
  userid: string;
  name: string;
  password: string;
  email: string;
  phone?: string;
  address?: string;
}

// 소셜 로그인 요청 DTO
class OAuthDto {
  code: string;
  provider: 'naver' | 'kakao';
}

/** 네이버 토큰 응답 타입 */
interface NaverTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: string;
  refresh_token_expires_in?: string;
}

/** 네이버 프로필 응답 타입 */
interface NaverProfileResponse {
  response: {
    id: string;
    email: string;
    name: string;
  };
}

/** 카카오 토큰 응답 타입 */
interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
}

/** 카카오 프로필 응답 타입 */
interface KakaoProfileResponse {
  id: number;
  kakao_account: {
    email: string;
    profile: {
      nickname: string;
    };
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /** 일반 로그인 */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.userid,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
    return this.authService.login(user);
  }

  /** 회원가입 */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const exist = await this.usersService.findByUserId(registerDto.userid);
    if (exist) {
      throw new BadRequestException('이미 존재하는 아이디입니다.');
    }
    await this.usersService.createUser(registerDto);
    return { message: '회원가입 성공' };
  }

  /** OAuth 소셜 로그인 */
  @Post('oauth')
  async oauthLogin(@Body() body: OAuthDto) {
    const { code, provider } = body;
    if (!code || !provider) {
      throw new BadRequestException('code와 provider를 입력해주세요.');
    }

    let profile;
    try {
      if (provider === 'naver') {
        profile = await this.getNaverProfile(code);
      } else if (provider === 'kakao') {
        profile = await this.getKakaoProfile(code);
      } else {
        throw new BadRequestException('지원하지 않는 소셜 로그인 제공자입니다.');
      }
    } catch (error) {
      throw new BadRequestException('소셜 로그인 프로필 조회 실패');
    }

    const user = await this.authService.validateOrCreateOAuthUser({
      userid: profile.id,
      name: profile.name,
      email: profile.email,
    });

    return this.authService.login(user);
  }

  /** 네이버 프로필 조회 */
  private async getNaverProfile(code: string) {
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
    const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;
    const NAVER_REDIRECT_URI = process.env.NAVER_REDIRECT_URI!;
    const state = 'NAVER_STATE';

    const tokenRes = await axios.get<NaverTokenResponse>(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`,
    );

    const accessToken = tokenRes.data.access_token;

    const profileRes = await axios.get<NaverProfileResponse>(
      'https://openapi.naver.com/v1/nid/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const response = profileRes.data.response;
    return {
      id: response.id,
      email: response.email,
      name: response.name,
    };
  }

  /** 카카오 프로필 조회 */
  private async getKakaoProfile(code: string) {
    const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID!;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET!;
    const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

    const tokenRes = await axios.post<KakaoTokenResponse>(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const accessToken = tokenRes.data.access_token;

    const profileRes = await axios.get<KakaoProfileResponse>(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const kakaoAccount = profileRes.data.kakao_account;

    return {
      id: profileRes.data.id.toString(),
      email: kakaoAccount.email,
      name: kakaoAccount.profile.nickname,
    };
  }
}

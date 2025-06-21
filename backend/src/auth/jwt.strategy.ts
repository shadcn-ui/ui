import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  department: string;
  position: string;
  mobilePhone?: string;
  internalPhone?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.cookies?.token) return req.cookies.token;
          const authHeader = req.headers.authorization;
          if (authHeader?.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    if (
      !payload?.sub ||
      !payload.role ||
      !payload.firstName ||
      !payload.lastName ||
      !payload.department ||
      !payload.position
    ) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || '',
      department: user.department,
      position: user.position,
      mobilePhone: user.mobilePhone || '',
      internalPhone: user.internalPhone || '',
    };
  }
}

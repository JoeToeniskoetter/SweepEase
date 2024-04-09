import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(
    private firebaseAuthService: FirebaseAuthService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(token: string) {
    try {
      const firebaseUser = await this.firebaseAuthService.validate(token);
      let user = await this.userRepo.findOne({
        where: { id: firebaseUser.uid },
        relations: ['company'],
      });
      if (!user) {
        user = await this.userRepo.save({
          id: firebaseUser.uid,
          email: firebaseUser.email,
        });
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  HttpException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtTokenPrefix } from '@/constants/token';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request?.headers?.authorization;
    this.logger.info('auth token', auth);
    if (!auth) {
      throw new UnauthorizedException();
    }
    const parts = auth.split(' ');
    if (parts.length !== 2 || (parts[0] || '').toLowerCase() !== 'bearer') {
      return false;
    }
    const token = parts[1];

    const userCacheKey = JwtTokenPrefix + token;
    let userInfo = await this.cacheManager.get<any>(userCacheKey);
    if (!userInfo) {
      // TODO: verify token
      // const { res, err } = await this.authenticationProvider.verify(
      //   new JwtTokenBaseParam({
      //     tenantCode: 3,
      //     token,
      //   }),
      // );
      // if (err) {
      //   throw new UnauthorizedException(err);
      // }
      // TODO: get user info from db
      const user = { res: { id: 1, name: 'test' }, err: null };
      this.logger.info(`auth user ${JSON.stringify(user)}`);
      if (user.err) {
        throw new HttpException('can not find user', 403);
      }
      userInfo = user.res;
      await this.cacheManager.set(userCacheKey, userInfo, 30 * 60);
    }
    // set user for request
    (request as Record<string, any>).user = userInfo;
    return !!userInfo;
  }
}

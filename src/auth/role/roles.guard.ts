import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NestMiddleware,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { CommentsService } from 'src/news/comments/comments.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly commentsService: CommentsService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { params, headers } = context.switchToHttp().getRequest();
    const { cookie } = headers;
    const user = await this.authService.verify(cookie.split('=')[1]);
    const _user = await this.usersService.findById(user.id);

    const _comment = await this.commentsService.findById(params.id);
    if (_comment.user.id == _user.id)
      return true;

    return requiredRoles.some((role) => _user.role === role);
  }
}

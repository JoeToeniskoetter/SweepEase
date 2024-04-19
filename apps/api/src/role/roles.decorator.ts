import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/users/entities/user.entity';

export const Roles = Reflector.createDecorator<UserRoles[]>();

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from '../entities/user.entity';

const AllowRoleUpdates = [UserRoles.ADMIN, UserRoles.USER];

export class UpdateUserDto {
  @IsEnum(AllowRoleUpdates)
  role: UserRoles;

  @IsString()
  @IsNotEmpty()
  id: string;
}

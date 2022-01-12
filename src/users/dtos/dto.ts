import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserPersonalInfoDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UserFullProfileDto extends UserPersonalInfoDto {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

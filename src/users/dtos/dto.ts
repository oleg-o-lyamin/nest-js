import { IsNotEmpty, IsString, IsEmail, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EditUserDto {
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.firstName)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.lastName)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ValidateIf((o) => o.email)
  email: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.role)
  role: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.password)
  password: string;
}
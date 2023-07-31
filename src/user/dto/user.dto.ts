import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@MinLength(6, {
		message: 'Не менее 6 символов'
	})
	@IsString()
	password?: string

	@IsString()
	name: string

	@IsString()
	description: string

	@IsString()
	avatarPath: string
}

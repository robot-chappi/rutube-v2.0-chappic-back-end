import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class PlaylistDto {
	@IsString()
	name: string

	@IsOptional()
	@IsBoolean()
	isPublic?: boolean

	@IsString()
	description: string

	@IsString()
	thumbnailPath: string
}

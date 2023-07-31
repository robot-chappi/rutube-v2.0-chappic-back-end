import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class VideoDto {
	@IsString()
	name: string

	@IsOptional()
	@IsBoolean()
	isPublic?: boolean

	@IsString()
	description: string

	@IsString()
	videoPath: string

	@IsString()
	thumbnailPath: string

	@IsNumber()
	duration: number
}

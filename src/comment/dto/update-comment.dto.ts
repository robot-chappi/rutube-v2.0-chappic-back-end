import { IsNumber, IsString } from 'class-validator'

export class UpdateCommentDto {
	@IsString()
	message: string

	@IsNumber()
	commentId: number
}

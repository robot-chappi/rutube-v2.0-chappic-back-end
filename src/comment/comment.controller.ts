import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../user/decorators/user.decorator'
import { CommentService } from './comment.service'
import { CommentDto } from './dto/comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Get()
	@Auth()
	async getAllByChannel(@CurrentUser('id') id: number) {
		return this.commentService.getAllByChannel(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createComment(@CurrentUser('id') id: number, @Body() dto: CommentDto) {
		return this.commentService.create(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async updateComment(
		@CurrentUser('id') id: number,
		@Body() dto: UpdateCommentDto
	) {
		return this.commentService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':commentId')
	@Auth()
	async deleteComment(
		@CurrentUser('id') id: number,
		@Param('commentId') commentId: string
	) {
		return this.commentService.delete(id, +commentId)
	}
}

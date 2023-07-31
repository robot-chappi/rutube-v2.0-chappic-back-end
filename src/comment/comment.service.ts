import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity } from './comment.entity'
import { Repository } from 'typeorm'
import { CommentDto } from './dto/comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>
	) {}

	async getAllByChannel(id: number) {
		return this.commentRepository.find({
			where: {
				video: {
					user: {
						id
					}
				}
			},
			order: {
				createdAt: 'DESC'
			},
			relations: {
				user: true,
				video: {
					user: true
				}
			},
			select: {
				user: {
					id: true,
					name: true,
					avatarPath: true,
					isVerified: true
				}
			}
		})
	}

	async create(id: number, dto: CommentDto) {
		const newComment = this.commentRepository.create({
			message: dto.message,
			video: { id: dto.videoId },
			user: { id }
		})

		return this.commentRepository.save(newComment)
	}

	async update(id: number, dto: UpdateCommentDto) {
		const comment = await this.commentRepository.findOne({
			where: {
				id: dto.commentId
			},
			relations: {
				user: true
			}
		})

		if (!comment || comment.user.id !== id)
			throw new BadRequestException(
				'Нет такого комментария или вы не являетесь его владельцем!'
			)

		return this.commentRepository.save({
			...comment,
			message: dto.message
		})
	}

	async delete(id: number, commentId: number) {
		const comment = await this.commentRepository.findOne({
			where: {
				id: commentId
			},
			relations: {
				user: true,
				video: {
					user: true
				}
			}
		})

		if (!comment || (comment.user.id !== id && comment.video.user.id !== id))
			throw new BadRequestException(
				'Нет такого комментария или вы не являетесь его владельцем или автором видео!'
			)

		return this.commentRepository.delete({ id: commentId })
	}
}

import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm'
import { VideoDto } from './dto/video.dto'
import { LikeEntity } from './like.entity'
import { VideoEntity } from './video.entity'

@Injectable()
export class VideoService {
	constructor(
		@InjectRepository(VideoEntity)
		private readonly videoRepository: Repository<VideoEntity>,
		@InjectRepository(LikeEntity)
		private readonly likeRepository: Repository<LikeEntity>
	) {}

	async byId(id: number, isPublic: boolean = false) {
		const video = await this.videoRepository.findOne({
			where: isPublic ? { id, isPublic: true } : { id },
			relations: {
				user: true,
				comments: {
					user: true
				},
				likes: {
					fromUser: true
				},
				savedToPlaylists: {
					fromPlaylist: true,
					toVideo: true
				}
			},
			select: {
				user: {
					id: true,
					name: true,
					avatarPath: true,
					isVerified: true,
					subscribersCount: true,
					subscriptions: true
				},
				likes: {
					id: true,
					fromUser: {
						id: true,
						name: true,
						avatarPath: true
					}
				}
			}
		})

		if (!video) throw new NotFoundException('Видео не найдено!')

		return video
	}

	async getMyVideos(id: number, isPublic: boolean) {
		return this.videoRepository.find({
			where: isPublic ? { user: { id }, isPublic: true } : { user: { id } },
			order: {
				createdAt: 'DESC'
			},
			relations: {
				user: true
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

	async getAll(searchTerm?: string) {
		let options: FindOptionsWhereProperty<VideoEntity> = {}

		if (searchTerm) {
			options = {
				name: ILike(`%${searchTerm}%`)
			}
		}

		return this.videoRepository.find({
			where: {
				...options,
				isPublic: true
			},
			order: {
				createdAt: 'DESC'
			},
			relations: {
				user: true
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

	async getMostPopularByViews() {
		return this.videoRepository.find({
			where: {
				views: MoreThan(0)
			},
			relations: {
				user: true
			},
			select: {
				user: {
					id: true,
					name: true,
					avatarPath: true,
					isVerified: true
				}
			},
			order: {
				views: -1
			}
		})
	}

	async getMostPopularByLikes() {
		return this.videoRepository.find({
			where: {
				likesCount: MoreThan(0)
			},
			relations: {
				user: true
			},
			select: {
				user: {
					id: true,
					name: true,
					avatarPath: true,
					isVerified: true
				}
			},
			order: {
				likesCount: -1
			}
		})
	}

	async create(userId: number) {
		const defaultValues = {
			name: '',
			user: { id: userId },
			videoPath: '',
			description: '',
			thumbnailPath: ''
		}

		const newVideo = this.videoRepository.create(defaultValues)
		const video = await this.videoRepository.save(newVideo)
		return video.id
	}

	async delete(id: number, videoId: number) {
		const video = await this.byId(videoId)

		if (video.user.id !== id)
			throw new BadRequestException('Вы не являетесь владельцем видео!')

		return this.videoRepository.delete({ id: videoId })
	}

	async updateCountViews(id: number) {
		const video = await this.byId(id)
		video.views++
		return this.videoRepository.save(video)
	}

	async updateLikes(id: number, videoId: number) {
		const data = {
			toVideo: { id: videoId },
			fromUser: { id }
		}

		const video = await this.byId(data.toVideo.id)
		const isLiked = await this.likeRepository.findOneBy(data)

		if (!isLiked) {
			const newLike = this.likeRepository.create(data)
			video.likesCount++
			await this.videoRepository.save(video)
			await this.likeRepository.save(newLike)
			return true
		}

		video.likesCount--
		await this.videoRepository.save(video)
		await this.likeRepository.delete(data)

		return false
	}

	async update(id: number, videoId: number, dto: VideoDto) {
		const video = await this.byId(videoId)

		if (video.user.id !== id)
			throw new BadRequestException('Вы не можете обновить чужое видео!')

		return this.videoRepository.save({
			...video,
			...dto
		})
	}
}

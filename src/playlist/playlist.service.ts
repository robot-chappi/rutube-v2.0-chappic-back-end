import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm'
import { SavedPlaylistEntity } from '../user/savedPlaylist.entity'
import { UserEntity } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { SavedToPlaylistEntity } from '../video/savedToPlaylist.entity'
import { VideoEntity } from '../video/video.entity'
import { VideoService } from '../video/video.service'
import { PlaylistDto } from './dto/playlist.dto'
import { PlaylistEntity } from './playlist.entity'

@Injectable()
export class PlaylistService {
	constructor(
		@InjectRepository(VideoEntity)
		private readonly videoRepository: Repository<VideoEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(PlaylistEntity)
		private readonly playlistRepository: Repository<PlaylistEntity>,
		@InjectRepository(SavedPlaylistEntity)
		private readonly savedPlaylistRepository: Repository<SavedPlaylistEntity>,
		@InjectRepository(SavedToPlaylistEntity)
		private readonly savedToPlaylistRepository: Repository<SavedToPlaylistEntity>,
		private readonly userService: UserService,
		private readonly videoService: VideoService
	) {}

	async byId(id: number, isPublic: boolean = false) {
		const playlist = await this.playlistRepository.findOne({
			where: isPublic ? { id, isPublic: true } : { id },
			relations: {
				user: true,
				videos: {
					toVideo: {
						user: true
					}
				},
				saved: {
					toPlaylist: true,
					fromUser: true
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
				videos: {
					id: true,
					toVideo: {
						id: true,
						name: true,
						isPublic: true,
						views: true,
						likesCount: true,
						duration: true,
						description: true,
						videoPath: true,
						thumbnailPath: true,
						user: {
							id: true,
							name: true,
							avatarPath: true,
							isVerified: true,
							subscribersCount: true,
							subscriptions: true
						}
					}
				}
			}
		})

		if (!playlist) throw new NotFoundException('Плейлист не найден!')

		return playlist
	}

	async getAll(searchTerm?: string) {
		let options: FindOptionsWhereProperty<PlaylistEntity> = {}

		if (searchTerm) {
			options = {
				name: ILike(`%${searchTerm}%`)
			}
		}

		return this.playlistRepository.find({
			where: {
				...options,
				isPublic: true
			},
			order: {
				createdAt: 'DESC'
			},
			relations: {
				user: true,
				videos: {
					toVideo: {
						user: true
					}
				},
				saved: {
					toPlaylist: true,
					fromUser: true
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
				videos: {
					id: true,
					toVideo: {
						id: true,
						name: true,
						isPublic: true,
						views: true,
						likesCount: true,
						duration: true,
						description: true,
						videoPath: true,
						thumbnailPath: true,
						user: {
							id: true,
							name: true,
							avatarPath: true,
							isVerified: true,
							subscribersCount: true,
							subscriptions: true
						}
					}
				}
			}
		})
	}

	async getMostPopularBySaved() {
		return this.playlistRepository.find({
			where: {
				saveCount: MoreThan(0)
			},
			relations: {
				user: true,
				saved: {
					toPlaylist: true,
					fromUser: true
				}
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
				saveCount: -1
			}
		})
	}

	async create(userId: number) {
		const defaultValues = {
			name: '',
			user: { id: userId },
			thumbnailPath: '',
			description: ''
		}

		const newPlaylist = this.playlistRepository.create(defaultValues)
		const playlist = await this.playlistRepository.save(newPlaylist)
		return playlist.id
	}

	async toggleVideo(id: number, playlistId: number, videoId: number) {
		const playlist = await this.byId(playlistId)

		if (playlist.user.id !== id)
			throw new BadRequestException(
				'Вы не можете добавить видео в чужой плейлист!'
			)

		const video = await this.videoService.byId(videoId)

		const data = {
			fromPlaylist: { id: playlist.id },
			toVideo: { id: video.id }
		}

		const isSaved = await this.savedToPlaylistRepository.findOneBy(data)

		if (!isSaved) {
			const newSave = this.savedToPlaylistRepository.create(data)
			playlist.videosCount++
			await this.playlistRepository.save(playlist)
			await this.savedToPlaylistRepository.save(newSave)
			return true
		}

		playlist.videosCount--
		await this.playlistRepository.save(playlist)
		await this.savedToPlaylistRepository.delete(data)
		return false
	}

	async updateSaved(id: number, playlistId: number) {
		const data = {
			fromUser: { id },
			toPlaylist: { id: playlistId }
		}

		const playlist = await this.byId(data.toPlaylist.id)

		if (playlist.user.id === data.fromUser.id)
			throw new BadRequestException(
				'Вы не можете сохранить свой плейлист к себе!'
			)

		const isSaved = await this.savedPlaylistRepository.findOneBy(data)

		if (!isSaved) {
			const newSave = this.savedPlaylistRepository.create(data)
			playlist.saveCount++
			await this.playlistRepository.save(playlist)
			await this.savedPlaylistRepository.save(newSave)
			return true
		}

		playlist.saveCount--
		await this.playlistRepository.save(playlist)
		await this.savedPlaylistRepository.delete(data)

		return false
	}

	async update(id: number, playlistId: number, dto: PlaylistDto) {
		const playlist = await this.byId(playlistId)

		if (playlist.user.id !== id)
			throw new BadRequestException('Вы не можете обновить чужой плейлист!')

		return this.playlistRepository.save({
			...playlist,
			...dto
		})
	}

	async delete(id: number, playlistId: number) {
		const playlist = await this.byId(playlistId)

		if (playlist.user.id !== id)
			throw new BadRequestException('Вы не являетесь владельцем плейлиста!')

		return this.playlistRepository.delete({ id: playlistId })
	}
}

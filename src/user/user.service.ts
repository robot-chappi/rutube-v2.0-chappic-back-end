import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { genSalt, hash } from 'bcryptjs'
import { Repository } from 'typeorm'
import { UserDto } from './dto/user.dto'
import { SubscriptionEntity } from './subscription.entity'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(SubscriptionEntity)
		private readonly subscriptionRepository: Repository<SubscriptionEntity>
	) {}

	async byId(id: number) {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: {
				videos: true,
				subscriptions: {
					toChannel: true
				},
				likes: {
					toVideo: true
				},
				savedPlaylists: {
					toPlaylist: true
				},
				playlists: true
			},
			order: {
				createdAt: 'DESC'
			}
		})

		if (!user) throw new NotFoundException('Пользователь не найден!')

		return user
	}

	async checkByEmail(email: string) {
		const user = await this.userRepository.findOneBy({ email })

		if (user)
			throw new BadRequestException('Пользователь с таким Email уже существует')

		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const user = await this.byId(id)

		const isSameUser = await this.userRepository.findOneBy({ email: dto.email })

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Email занят!')

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email
		user.name = dto.name
		user.description = dto.description
		user.avatarPath = dto.avatarPath

		return this.userRepository.save(user)
	}

	async subscribe(id: number, channelId: number) {
		const user = await this.byId(channelId)

		if (user.id === id)
			throw new BadRequestException('Вы не можете подписаться на себя!')

		const data = {
			toChannel: { id: user.id },
			fromUser: { id }
		}

		const isSubscribed = await this.subscriptionRepository.findOneBy(data)

		if (!isSubscribed) {
			const newSubscription = this.subscriptionRepository.create(data)
			user.subscribersCount++
			await this.userRepository.save(user)
			await this.subscriptionRepository.save(newSubscription)

			return true
		}

		user.subscribersCount--
		await this.userRepository.save(user)
		await this.subscriptionRepository.delete(data)

		return false
	}

	async getAll() {
		return this.userRepository.find()
	}

	async delete(id: number) {
		return this.userRepository.delete({ id })
	}
}

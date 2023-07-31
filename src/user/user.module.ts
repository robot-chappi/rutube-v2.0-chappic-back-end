import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { SubscriptionEntity } from './subscription.entity'
import { LikeEntity } from '../video/like.entity'

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		TypeOrmModule.forFeature([UserEntity, LikeEntity, SubscriptionEntity])
	]
})
export class UserModule {}

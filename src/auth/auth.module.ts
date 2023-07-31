import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './stategies/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '../config/jwt.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { SubscriptionEntity } from '../user/subscription.entity'

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService, JwtStrategy],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		TypeOrmModule.forFeature([UserEntity, SubscriptionEntity])
	]
})
export class AuthModule {}

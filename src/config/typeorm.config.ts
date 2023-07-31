import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const getTypeOrmConfig = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: 'localhost',
	port: configService.get<number>('PORT'),
	database: configService.get<string>('DATABASE'),
	username: configService.get<string>('USERNAME'),
	password: configService.get<string>('PASSWORD'),
	autoLoadEntities: true,
	synchronize: true
})

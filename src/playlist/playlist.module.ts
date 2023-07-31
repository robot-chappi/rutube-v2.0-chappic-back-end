import { Module } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { PlaylistController } from './playlist.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { SavedPlaylistEntity } from '../user/savedPlaylist.entity'
import { VideoEntity } from '../video/video.entity'
import { PlaylistEntity } from './playlist.entity'
import { SavedToPlaylistEntity } from '../video/savedToPlaylist.entity'
import { UserService } from '../user/user.service'
import { VideoService } from '../video/video.service'
import { LikeEntity } from '../video/like.entity'
import { SubscriptionEntity } from '../user/subscription.entity'

@Module({
	controllers: [PlaylistController],
	providers: [PlaylistService, UserService, VideoService],
	imports: [
		TypeOrmModule.forFeature([
			PlaylistEntity,
			UserEntity,
			VideoEntity,
			SavedPlaylistEntity,
			SavedToPlaylistEntity,
			LikeEntity,
			SubscriptionEntity
		])
	]
})
export class PlaylistModule {}

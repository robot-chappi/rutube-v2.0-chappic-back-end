import { Column, Entity, OneToMany } from 'typeorm'
import { Base } from '../utils/base'
import { VideoEntity } from '../video/video.entity'
import { SubscriptionEntity } from './subscription.entity'
import { LikeEntity } from '../video/like.entity'
import { PlaylistEntity } from '../playlist/playlist.entity'
import { SavedPlaylistEntity } from './savedPlaylist.entity'

@Entity('User')
export class UserEntity extends Base {
	@Column({ unique: true })
	email: string

	@Column({ select: false })
	password: string

	@Column({ default: '' })
	name: string

	@Column({ default: false, name: 'is_verified' })
	isVerified: boolean

	@Column({ default: 0, name: 'subscribers_count' })
	subscribersCount?: number

	@Column({ default: '', type: 'text' })
	description: string

	@Column({ default: '', name: 'avatar_path' })
	avatarPath: string

	@OneToMany(() => VideoEntity, video => video.user)
	videos: VideoEntity[]

	@OneToMany(() => PlaylistEntity, playlist => playlist.user)
	playlists: PlaylistEntity[]

	@OneToMany(() => SubscriptionEntity, sub => sub.fromUser)
	subscriptions: SubscriptionEntity[]

	@OneToMany(() => LikeEntity, like => like.fromUser)
	likes: LikeEntity[]

	@OneToMany(() => SavedPlaylistEntity, save => save.fromUser)
	savedPlaylists: SavedPlaylistEntity[]

	@OneToMany(() => SubscriptionEntity, sub => sub.toChannel)
	subscribers: SubscriptionEntity[]
}

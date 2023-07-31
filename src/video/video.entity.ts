import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { CommentEntity } from '../comment/comment.entity'
import { UserEntity } from '../user/user.entity'
import { Base } from '../utils/base'
import { LikeEntity } from './like.entity'
import { SavedToPlaylistEntity } from './savedToPlaylist.entity'

@Entity('Video')
export class VideoEntity extends Base {
	@Column()
	name: string

	@Column({ default: false, name: 'is_public' })
	isPublic: boolean

	@Column({ default: 0 })
	views?: number

	@Column({ default: 0, name: 'likes_count' })
	likesCount?: number

	@Column({ default: 0 })
	duration?: number

	@Column({ default: '', type: 'text' })
	description: string

	@Column({ default: '', name: 'video_path' })
	videoPath: string

	@Column({ default: '', name: 'thumbnail_path' })
	thumbnailPath: string

	@ManyToOne(() => UserEntity, user => user.videos, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@OneToMany(() => CommentEntity, comment => comment.video)
	comments: CommentEntity[]

	@OneToMany(() => LikeEntity, like => like.toVideo)
	likes: LikeEntity[]

	@OneToMany(() => SavedToPlaylistEntity, saved => saved.toVideo)
	savedToPlaylists: SavedToPlaylistEntity[]
}

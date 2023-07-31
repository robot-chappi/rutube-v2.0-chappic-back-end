import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Base } from '../utils/base'
import { UserEntity } from '../user/user.entity'
import { SavedPlaylistEntity } from '../user/savedPlaylist.entity'
import { SavedToPlaylistEntity } from '../video/savedToPlaylist.entity'

@Entity('Playlist')
export class PlaylistEntity extends Base {
	@Column({ default: '' })
	name: string

	@Column({ default: '', type: 'text' })
	description: string

	@Column({ default: '', name: 'thumbnail_path' })
	thumbnailPath: string

	@Column({ default: false, name: 'is_public' })
	isPublic: boolean

	@Column({ default: 0, name: 'videos_count' })
	videosCount?: number

	@Column({ default: 0, name: 'save_count' })
	saveCount?: number

	@ManyToOne(() => UserEntity, user => user.videos, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@OneToMany(() => SavedToPlaylistEntity, save => save.fromPlaylist)
	videos: SavedToPlaylistEntity[]

	@OneToMany(() => SavedPlaylistEntity, playlist => playlist.toPlaylist)
	saved: SavedPlaylistEntity[]
}

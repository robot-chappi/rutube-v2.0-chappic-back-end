import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from '../utils/base'
import { PlaylistEntity } from '../playlist/playlist.entity'
import { UserEntity } from './user.entity'

@Entity('SavedPlaylist')
export class SavedPlaylistEntity extends Base {
	@ManyToOne(() => UserEntity, user => user.savedPlaylists, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'from_user_id' })
	fromUser: UserEntity

	@ManyToOne(() => PlaylistEntity, playlist => playlist.saved, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'to_playlist_id' })
	toPlaylist: PlaylistEntity
}

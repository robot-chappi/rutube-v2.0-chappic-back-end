import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from '../utils/base'
import { VideoEntity } from './video.entity'
import { PlaylistEntity } from '../playlist/playlist.entity'

@Entity('SavedToPlaylist')
export class SavedToPlaylistEntity extends Base {
	@ManyToOne(() => PlaylistEntity, playlist => playlist.videos, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'from_playlist_id' })
	fromPlaylist: PlaylistEntity

	@ManyToOne(() => VideoEntity, video => video.savedToPlaylists, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'to_video_id' })
	toVideo: VideoEntity
}

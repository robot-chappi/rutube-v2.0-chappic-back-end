import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from '../utils/base'
import { UserEntity } from '../user/user.entity'
import { VideoEntity } from './video.entity'

@Entity('Like')
export class LikeEntity extends Base {
	@ManyToOne(() => UserEntity, user => user.likes, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'from_user_id' })
	fromUser: UserEntity

	@ManyToOne(() => VideoEntity, video => video.likes, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'to_video_id' })
	toVideo: VideoEntity
}

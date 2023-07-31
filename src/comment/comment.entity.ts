import { Base } from '../utils/base'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { VideoEntity } from '../video/video.entity'

@Entity('Comment')
export class CommentEntity extends Base {
	@Column({ type: 'text' })
	message: string

	@ManyToOne(() => UserEntity, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@ManyToOne(() => VideoEntity, video => video.comments, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'video_id' })
	video: VideoEntity
}

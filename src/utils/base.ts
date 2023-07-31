import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

export abstract class Base {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@UpdateDateColumn({ name: 'created_at' })
	createdAt: Date
}

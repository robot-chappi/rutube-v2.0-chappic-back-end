import { BadRequestException, Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { extname } from 'path'
import * as uuid from 'uuid'
import { IMediaResponse } from './interface/media.interface'

@Injectable()
export class MediaService {
	async saveMedia(
		mediaFile: Express.Multer.File,
		folder = 'default'
	): Promise<IMediaResponse> {
		if (mediaFile.size > 2000000000)
			throw new BadRequestException(
				'Размер файла не должен превышать 2-х гигабайт!'
			)

		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)

		let filename = uuid.v4() + extname(mediaFile.originalname)

		await writeFile(`${uploadFolder}/${filename}`, mediaFile.buffer)

		return {
			url: `/uploads/${folder}/${filename}`,
			name: filename
		}
	}
}

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { VideoService } from './video.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { VideoDto } from './dto/video.dto'
import { CurrentUser } from '../user/decorators/user.decorator'

@Controller('video')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Get('get-private/:id')
	@Auth()
	async getVideoPrivate(@Param('id') id: string) {
		return this.videoService.byId(+id)
	}

	@Get('my-videos')
	@Auth()
	async getMyVideos(
		@CurrentUser('id') id: number,
		@Query('isPublic') isPublic: boolean
	) {
		return this.videoService.getMyVideos(id, isPublic)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.videoService.getAll(searchTerm)
	}

	@Get('most-popular/views')
	async getMostPopularByViews() {
		return this.videoService.getMostPopularByViews()
	}

	@Get('most-popular/likes')
	async getMostPopularByLikes() {
		return this.videoService.getMostPopularByLikes()
	}

	@Get(':id')
	async getVideo(@Param('id') id: string) {
		return this.videoService.byId(+id)
	}

	@HttpCode(200)
	@Post()
	@Auth()
	async createVideo(@CurrentUser('id') id: number) {
		return this.videoService.create(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':videoId')
	@Auth()
	async updateVideo(
		@CurrentUser('id') id: number,
		@Param('videoId') videoId: string,
		@Body() dto: VideoDto
	) {
		return this.videoService.update(id, +videoId, dto)
	}

	@HttpCode(200)
	@Delete(':videoId')
	@Auth()
	async deleteVideo(
		@CurrentUser('id') id: number,
		@Param('videoId') videoId: string
	) {
		return this.videoService.delete(id, +videoId)
	}

	@HttpCode(200)
	@Put('update-views/:videoId')
	async updateViews(@Param('videoId') videoId: string) {
		return this.videoService.updateCountViews(+videoId)
	}

	@HttpCode(200)
	@Put('update-likes/:videoId')
	@Auth()
	async updateLikes(
		@CurrentUser('id') id: number,
		@Param('videoId') videoId: string
	) {
		return this.videoService.updateLikes(id, +videoId)
	}
}

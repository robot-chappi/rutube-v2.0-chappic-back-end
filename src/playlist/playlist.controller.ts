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
import { PlaylistService } from './playlist.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../user/decorators/user.decorator'
import { PlaylistDto } from './dto/playlist.dto'

@Controller('playlist')
export class PlaylistController {
	constructor(private readonly playlistService: PlaylistService) {}

	@Get('get-private/:id')
	@Auth()
	async getPlaylistPrivate(@Param('id') id: string) {
		return this.playlistService.byId(+id)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.playlistService.getAll(searchTerm)
	}

	@Get('most-popular/saved')
	async getMostPopularBySaved() {
		return this.playlistService.getMostPopularBySaved()
	}

	@Get(':id')
	async getPlaylist(@Param('id') id: string) {
		return this.playlistService.byId(+id)
	}

	@HttpCode(200)
	@Post()
	@Auth()
	async createPlaylist(@CurrentUser('id') id: number) {
		return this.playlistService.create(+id)
	}

	@HttpCode(200)
	@Put('update-saved/:playlistId')
	@Auth()
	async updateSaved(
		@CurrentUser('id') id: number,
		@Param('playlistId') playlistId: string
	) {
		return this.playlistService.updateSaved(id, +playlistId)
	}

	@HttpCode(200)
	@Put('toggle-video')
	@Auth()
	async toggleVideo(
		@CurrentUser('id') id: number,
		@Query('playlistId') playlistId: string,
		@Query('videoId') videoId: string
	) {
		return this.playlistService.toggleVideo(id, +playlistId, +videoId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':playlistId')
	@Auth()
	async updatePlaylist(
		@CurrentUser('id') id: number,
		@Param('playlistId') playlistId: string,
		@Body() dto: PlaylistDto
	) {
		return this.playlistService.update(id, +playlistId, dto)
	}

	@HttpCode(200)
	@Delete(':playlistId')
	@Auth()
	async deletePlaylist(
		@CurrentUser('id') id: number,
		@Param('playlistId') playlistId: string
	) {
		return this.playlistService.delete(id, +playlistId)
	}
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar time' })
  @ApiResponse({ status: 201, description: 'Time criado com sucesso' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTeamDto,
  ) {
    return this.teamsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar meus times' })
  @ApiResponse({ status: 200, description: 'Lista de times' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.teamsService.findAll(userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar times por nome' })
  async search(@Query('q') query: string, @CurrentUser('id') userId: string) {
    return this.teamsService.search(query || '', userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do time com elenco' })
  @ApiResponse({ status: 200, description: 'Detalhes do time' })
  @ApiResponse({ status: 404, description: 'Time nao encontrado' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.teamsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar time (somente owner)' })
  @ApiResponse({ status: 200, description: 'Time atualizado' })
  @ApiResponse({ status: 403, description: 'Somente o owner pode editar' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir time (somente owner)' })
  @ApiResponse({ status: 204, description: 'Time excluido' })
  @ApiResponse({ status: 403, description: 'Somente o owner pode excluir' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.teamsService.remove(id, userId);
  }

  @Post(':id/avatar')
  @ApiOperation({ summary: 'Upload de brasão do time (somente owner)' })
  @ApiResponse({ status: 200, description: 'Brasão atualizado' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadAvatar(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.teamsService.uploadAvatar(id, userId, file);
  }
}

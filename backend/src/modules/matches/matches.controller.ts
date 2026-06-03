import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MatchesService } from './matches.service';
import { PointDto } from './dto/point.dto';
import { SetFinishDto } from './dto/set-finish.dto';
import { WalkoverDto } from './dto/walkover.dto';
import { TimeoutDto } from './dto/timeout.dto';
import { SubstitutionDto } from './dto/substitution.dto';
import { NearbyQueryDto } from './dto/nearby-query.dto';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Find live matches near user location' })
  @ApiResponse({ status: 200, description: 'Nearby live matches' })
  findNearby(@Query() query: NearbyQueryDto) {
    return this.matchesService.findNearby(query);
  }

  @Post('referee-enter')
  @ApiOperation({ summary: 'Enter referee code to become match referee' })
  @ApiResponse({ status: 200, description: 'Referee assigned to match' })
  async enterRefereeCode(
    @CurrentUser('id') userId: string,
    @Body() body: { code: string },
  ) {
    return this.matchesService.enterRefereeCode(userId, body.code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find match by ID' })
  @ApiResponse({ status: 200, description: 'Match found' })
  async findOne(@Param('id') matchId: string, @CurrentUser('id') userId: string) {
    return this.matchesService.findOne(matchId, userId);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get match timeline (points + events)' })
  @ApiResponse({ status: 200, description: 'Match timeline' })
  async getTimeline(@Param('id') matchId: string) {
    return this.matchesService.getTimeline(matchId);
  }

  @Post(':id/generate-referee-code')
  @ApiOperation({ summary: 'Generate referee code for a match' })
  @ApiResponse({ status: 201, description: 'Referee code generated' })
  async generateRefereeCode(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.matchesService.generateRefereeCode(matchId, userId);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Iniciar partida' })
  @ApiResponse({ status: 200, description: 'Partida iniciada' })
  async startMatch(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.matchesService.startMatch(matchId, userId);
  }

  @Patch(':id/point')
  @ApiOperation({ summary: 'Registrar ponto' })
  @ApiResponse({ status: 200, description: 'Ponto registrado' })
  async registerPoint(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: PointDto,
  ) {
    return this.matchesService.registerPoint(matchId, userId, dto);
  }

  @Patch(':id/remove-point')
  @ApiOperation({ summary: 'Remover ponto' })
  @ApiResponse({ status: 200, description: 'Ponto removido' })
  async removePoint(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: PointDto,
  ) {
    return this.matchesService.removePoint(matchId, userId, dto);
  }

  @Patch(':id/set-finish')
  @ApiOperation({ summary: 'Finalizar set' })
  @ApiResponse({ status: 200, description: 'Set finalizado' })
  async finishSet(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SetFinishDto,
  ) {
    return this.matchesService.finishSet(matchId, userId, dto);
  }

  @Patch(':id/finish')
  @ApiOperation({ summary: 'Finalizar partida' })
  @ApiResponse({ status: 200, description: 'Partida finalizada' })
  async finishMatch(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.matchesService.finishMatch(matchId, userId);
  }

  @Patch(':id/walkover')
  @ApiOperation({ summary: 'Declarar W.O.' })
  @ApiResponse({ status: 200, description: 'W.O. declarado' })
  async declareWalkover(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: WalkoverDto,
  ) {
    return this.matchesService.declareWalkover(matchId, userId, dto);
  }

  @Patch(':id/timeout')
  @ApiOperation({ summary: 'Registrar tempo técnico (timeout)' })
  @ApiResponse({ status: 200, description: 'Timeout registrado' })
  async registerTimeout(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: TimeoutDto,
  ) {
    return this.matchesService.registerTimeout(matchId, userId, dto);
  }

  @Patch(':id/substitution')
  @ApiOperation({ summary: 'Registrar substituição de jogador' })
  @ApiResponse({ status: 200, description: 'Substituição registrada' })
  async registerSubstitution(
    @Param('id') matchId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SubstitutionDto,
  ) {
    return this.matchesService.registerSubstitution(matchId, userId, dto);
  }
}

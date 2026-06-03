import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { QueryAdminTournamentsDto } from './dto/query-admin-tournaments.dto';
import { QueryLogsDto } from './dto/query-logs.dto';
import { QueryMetricsDto } from './dto/query-metrics.dto';
import { UpdateSystemDto } from './dto/update-system.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('api/admin')
@UseGuards(JwtAuthGuard)
@Roles('SUPER_ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ───────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard KPIs' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  // ─── User Management ─────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users with search and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  listUsers(@Query() query: QueryUsersDto) {
    return this.adminService.listUsers(query);
  }

  @Patch('users/:id/block')
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({ status: 200, description: 'User blocked' })
  blockUser(@Param('id') id: string) {
    return this.adminService.blockUser(id);
  }

  @Patch('users/:id/unblock')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({ status: 200, description: 'User unblocked' })
  unblockUser(@Param('id') id: string) {
    return this.adminService.unblockUser(id);
  }

  // ─── Tournament Management ───────────────────────────────

  @Get('tournaments')
  @ApiOperation({ summary: 'List all tournaments with filters' })
  @ApiResponse({ status: 200, description: 'Paginated tournament list' })
  listTournaments(@Query() query: QueryAdminTournamentsDto) {
    return this.adminService.listTournaments(query);
  }

  @Patch('tournaments/:id/block')
  @ApiOperation({ summary: 'Block/flag a tournament' })
  @ApiResponse({ status: 200, description: 'Tournament blocked' })
  blockTournament(@Param('id') id: string) {
    return this.adminService.blockTournament(id);
  }

  @Delete('tournaments/:id')
  @ApiOperation({ summary: 'Soft delete a tournament' })
  @ApiResponse({ status: 200, description: 'Tournament soft-deleted' })
  @HttpCode(HttpStatus.OK)
  deleteTournament(@Param('id') id: string) {
    return this.adminService.deleteTournament(id);
  }

  // ─── Error Logs ──────────────────────────────────────────

  @Get('logs')
  @ApiOperation({ summary: 'Query error logs' })
  @ApiResponse({ status: 200, description: 'List of logs' })
  getLogs(@Query() query: QueryLogsDto) {
    return this.adminService.getLogs(query);
  }

  // ─── Monitoring ──────────────────────────────────────────

  @Get('monitoring')
  @ApiOperation({ summary: 'Get system monitoring data' })
  @ApiResponse({ status: 200, description: 'Monitoring stats' })
  getMonitoring() {
    return this.adminService.getMonitoring();
  }

  // ─── System Control ──────────────────────────────────────

  @Get('system')
  @ApiOperation({ summary: 'Get system status' })
  @ApiResponse({ status: 200, description: 'System status' })
  getSystem() {
    return this.adminService.getSystem();
  }

  @Patch('system')
  @ApiOperation({ summary: 'Update system settings (maintenance mode, global message)' })
  @ApiResponse({ status: 200, description: 'Updated system settings' })
  updateSystem(@Body() dto: UpdateSystemDto) {
    return this.adminService.updateSystem(dto);
  }

  // ─── Metrics ─────────────────────────────────────────────

  @Get('metrics')
  @ApiOperation({ summary: 'Get platform metrics' })
  @ApiResponse({ status: 200, description: 'Metrics data' })
  getMetrics(@Query() query: QueryMetricsDto) {
    return this.adminService.getMetrics(query);
  }
}

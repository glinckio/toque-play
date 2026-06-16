import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MaintenanceMiddleware } from '../../common/middleware/maintenance.middleware';
import { BullBoardMiddleware } from './bull-board.middleware';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MaintenanceMiddleware).exclude('api/admin').forRoutes('*');

    consumer.apply(BullBoardMiddleware).forRoutes('api/admin/queues');
  }
}

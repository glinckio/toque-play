import { Module } from '@nestjs/common';
import { TournamentRegistrationsController } from './tournament-registrations.controller';
import { RegistrationsController } from './registrations.controller';
import { PaymentsController } from './payments.controller';
import { PaymentsGateway } from './payments.gateway';
import { RegistrationsService } from './registrations.service';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { JobsModule } from '../../common/jobs/jobs.module';

@Module({
  imports: [TournamentsModule, JobsModule],
  controllers: [
    TournamentRegistrationsController,
    RegistrationsController,
    PaymentsController,
  ],
  providers: [RegistrationsService, PaymentsGateway],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}

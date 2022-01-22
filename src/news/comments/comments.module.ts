import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { UsersModule } from '../../users/users.module';
import { NewsModule } from '../news.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [CommentsService, SocketCommentsGateway],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    forwardRef(() => NewsModule),
    UsersModule,
    AuthModule,
  ],
})
export class CommentsModule {}

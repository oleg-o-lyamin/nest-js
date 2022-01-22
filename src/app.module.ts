import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news/news.entity';
import { UsersEntity } from './users/users.entity';
import { CommentsEntity } from './news/comments/comments.entity';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { CommentsModule } from './news/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'nest-news-blog',
      entities: [NewsEntity, UsersEntity, CommentsEntity],
      synchronize: true,
    }),
    NewsModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MailModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from 'express-handlebars';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UsersEntity } from './users/users.entity';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine(
    'hbs',
    engine({
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      defaultLayout: 'layout',
      extname: 'hbs',
      helpers: {
        inc(level) {
          return level + 20;
        },
        date(date: Date) {
          return date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
        fullname(user: UsersEntity) {
          return user.firstName + ' ' + user.lastName;
        },
        usersEqual(user1: UsersEntity, user2: UsersEntity) {
          return user1 != null && user2 != null && user1.id == user2.id;
        },
      },
    }),
  );
  hbs.registerPartials(__dirname + '/views/partials');
  app.setViewEngine('hbs');

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Новостной блог')
    .setDescription('Документация к API новостного блога')
    .setVersion('1.0')
    .addTag('news-blog')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from 'express-handlebars';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UsersEntity } from './users/users.entity';

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
      },
    }),
  );
  hbs.registerPartials(__dirname + '/views/partials');
  app.setViewEngine('hbs');

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();

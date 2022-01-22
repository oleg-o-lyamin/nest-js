import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { NewsService } from './news/news.service';
import { NewsEntity } from './news/news.entity';
import { NewsController } from './news/news.controller';

describe('App', () => {
  let app: INestApplication;
  let service: NewsService;
  let controller: NewsController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    service = moduleRef.get<NewsService>(NewsService);
    controller = moduleRef.get<NewsController>(NewsController);
    await app.init();
  });

  it('authenticates a user and includes a jwt token in the response', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'oleg.lyamin@gmail.com', password: '12345' })
      .expect(201);

    const jwtToken = response.body.access_token;

    expect(jwtToken).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    );
  });

  it('fails to authenticate user with an incorrect password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(401);

    expect(response.body.access_token).not.toBeDefined();
  });

  it('fails to authenticate user that does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'test' })
      .expect(401);

    expect(response.body.access_token).not.toBeDefined();
  });

  it("checks if first element of an array returned by news service's findAll method has NewsEntity type", async () => {
    await service.findAll().then((data) => {
      expect(data[0]).toBeInstanceOf(NewsEntity);
    });
  });

  it("checks if first element of an array returned by news service's findAll method has cover", async () => {
    await service.findAll().then((data) => {
      expect(data[0].cover).toBeDefined();
    });
  });

  it('checks that NewsController.getAllNews returns all news from the database', async () => {
    const cData = await controller.getAllNews();
    const sData = await service.findAll();
    expect(cData).toEqual(expect.arrayContaining(sData));
    expect(cData.length).toEqual(sData.length);
  });

  it('checks that api-method returning all news works', async () => {
    await request(app.getHttpServer()).get('/news/api/all').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

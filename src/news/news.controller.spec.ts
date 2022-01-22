import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments/comments.service';
import { NewsController } from './news.controller';
import { NewsEntity } from './news.entity';
import { NewsService } from './news.service';

describe('NewsController', () => {
  let controller: NewsController;
  let service: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            findAll: () => {},
          },
        },
        {
          provide: CommentsService,
          useValue: {
            get: jest.fn(() => 0),
          },
        },
        {
          provide: UsersService,
          useValue: {
            get: jest.fn(() => 0),
          },
        },
        {
          provide: AuthService,
          useValue: {
            get: jest.fn(() => 0),
          },
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    service = module.get<NewsService>(NewsService);
  });

  it('should return an array of news', async () => {
    const news1 = new NewsEntity();
    news1.id = 1;
    news1.title = 'Заголовок первой новости';
    news1.description = 'Описание первой новости';

    const news2 = new NewsEntity();
    news2.id = 2;
    news2.title = 'Заголовок второй новости';
    news2.description = 'Описание второй новости';

    const newsArray = [news1, news2];

    jest.spyOn(service, 'findAll').mockImplementation(async () => newsArray);
    expect(await controller.getAllNews()).toBe(newsArray);
  });
});

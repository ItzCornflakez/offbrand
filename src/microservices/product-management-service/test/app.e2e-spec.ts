import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateCategoryDto } from 'src/category/dto/createCategoryBody.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    const configService = app.get(ConfigService);
    const port = configService.get<number>('APP_PORT');
    await app.listen(port);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Category', () => {
    const categoryTestDto: CreateCategoryDto = {
      name: 'TestCategory',
      desc: 'This is a test category',
    };

    describe('Create Category', () => {
      it('Should return bad request if no name is provided', async () => {
        const response = await pactum
          .spec()
          .post('/categories')
          .withBody({
            desc: categoryTestDto.desc,
          })
          .expectStatus(400);
      });
      it('Should return bad request if no desc is provided', async () => {
        const response = await pactum
          .spec()
          .post('/categories')
          .withBody({
            name: categoryTestDto.name,
          })
          .expectStatus(400);
      });
      it('Should return bad request if no request body is provided', async () => {
        const response = await pactum
          .spec()
          .post('/categories')
          .expectStatus(400);
      });
      it('Should create a new category', () => {
        const response = pactum
          .spec()
          .post('/category')
          .withBody(categoryTestDto)
          .expectStatus(201);
      });
    });
  });
});

import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule,ConfigService } from "@nestjs/config";
import { RegisterDto } from "src/auth/dtos/register.dto";

describe("App e2e", () => {

  let app: INestApplication;
  let configService: ConfigService;

  beforeAll( async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [ 
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test'
        })
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )

    await app.init();
    await app.listen(3030)

    configService = app.get<ConfigService>(ConfigService);

  });

  describe('Auth', () => {
    describe('Register', () => {
      it('Should Register', () => {
        const dto: RegisterDto = {
          username: 'admin',
          password: 'admin',
          email: 'admin@testing.com'
        }

        return pactum.spec().post(
          'http://localhost:3000/auth/register'
        ).withBody(dto)
         .expectStatus(201);
      })
    });

    describe('Login', () => {});

    describe('Logout', () => {});
  });

  describe('Task', () => {

    describe('Get list of all tasks for user', () => {});

    describe('Create Tasks', () => {});

    describe('Get a specific task by ID', () => {});

    describe('Get a list of all tasks with a specific due date', () => {});

    describe('Update a specific task', () => {});

    describe('Delete a specific task', () => {});

    describe('Get tasks with specified priority', () => {});
  });

  describe('User', () => {

    describe('Get User Profile', () => {});

    describe('Get User Dashboard', () => {});
  });

  afterAll(() => {
    app.close();
  });

  it.todo("Should pass");
  
});
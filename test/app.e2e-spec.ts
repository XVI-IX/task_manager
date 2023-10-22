import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule,ConfigService } from "@nestjs/config";

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

    configService = app.get<ConfigService>(ConfigService);

    describe('Auth', () => {

      describe('Register', () => {});

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

  });

  afterAll(() => {
    app.close();
  });

  it.todo("Should pass");
  
});
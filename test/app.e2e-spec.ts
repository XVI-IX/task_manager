import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule,ConfigService } from "@nestjs/config";
import { RegisterDto } from "src/auth/dtos/register.dto";
import { LoginDto } from "src/auth/dtos/login.dto";
import { PostgresService } from "../src/postgres/postgres.service";
import { TaskDto } from "src/task/dto/task.dto";

describe("App e2e", () => {

  let app: INestApplication;
  let configService: ConfigService;
  let psql: PostgresService;
  let authToken: string;
  let taskId: number;

  beforeAll( async () => {
    process.env.NODE_ENV = 'test';

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
    await app.listen(3030);

    psql = app.get<PostgresService>(PostgresService);

    psql.clean();

    pactum.request.setBaseUrl('http://localhost:3030');
    configService = app.get<ConfigService>(ConfigService);

  });

  describe('🔒 Auth', () => {
    describe('Register', () => {
      it('Should Register', () => {
        const dto: RegisterDto = {
          username: 'admin',
          password: 'admin',
          email: 'admin@testing.com'
        }

        return pactum.spec().post(
          '/auth/register'
        ).withBody(dto)
         .expectStatus(201);
      })
    });

    describe('Login', () => {
      it('Should Login', async () => {
        const dto: LoginDto = {
          email: 'admin@testing.com',
          password: 'admin'
        }

        const response = await pactum.spec().post(
          '/auth/login'
        ).withBody(dto)
         .expectStatus(200)
         .end();

        authToken = response.body.access_token;

        // authToken = response.;

        return response;
      });
    });

    describe('Logout', () => {
      it('Should redirect', () => {
        pactum.spec().get(
          '/auth/logout'
        ).withFollowRedirects(true)
         .expectStatus(200);
      });
    });
  });

  describe('📒 Task', () => {

    describe('Get all tasks', () => {
      it('should get all tasks by user', () => {
        return pactum.spec().get(
          '/tasks'
        )
        .withBearerToken(authToken)
        .expectStatus(200)
        .end();
      });
    });

    describe('Create Tasks', () => {
      it('Should create task', async () => {
        const dto: TaskDto = {
          title: 'Task Title',
          description: 'Task Description',
          due_date: "2023-10-23",
          priority: 0,
          category_id: 1
        }

        const result = await pactum.spec().post(
          '/tasks/create'
        )
        .withBearerToken(authToken)
        .withBody(dto)
        .expectStatus(201)
        .end();
         
        taskId = result.body.task.task_id;

        return result;
      })
    });

    describe('Get a specific task by ID', () => {
      it('Should get task with :id', () => {

        return pactum.spec().get(
          `/tasks/${taskId}`
        )
        .withBearerToken(authToken)
        .expectStatus(200);
      })
    });

    describe('Get a list of all tasks with a specific due date', () => {});

    describe('Update a specific task', () => {
      it('Should update task with specified id', () => {
        const dto: TaskDto = {
          title: "Task Title 2",
          description: "Task Description 2",
          due_date: "2023-12-23",
          priority: 1,
          category_id: 2
      }

      return pactum.spec().patch(
        `/tasks/${taskId}/update`
      )
      .withBearerToken(authToken)
      .withBody(dto)
      .expectStatus(200);
      });
    });

    describe('Delete a specific task', () => {
      it('Should delete specified task', () => {
        return pactum.spec().delete(
          `/tasks/${taskId}/delete`
        )
        .withBearerToken(authToken)
        .expectStatus(200);
      })
    });

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
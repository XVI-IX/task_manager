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

  });

  afterAll(() => {
    app.close();
  });

  it.todo("Should pass");
  
});
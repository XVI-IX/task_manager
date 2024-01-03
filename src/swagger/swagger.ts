import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription(
      'a task management system where users can create, update, delete, and view tasks. You can implement features like user authentication, task categorization, due dates, and task prioritization. Use PostgreSQL to store task data.',
    )
    .setVersion('1.0')
    .addTag('project')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

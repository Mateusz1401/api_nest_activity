import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cron from 'node-cron';
import { AppModule } from './app.module';
import { SeedService } from './database/seed.service';
import { CalendarService } from './calendar/calendar.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seedService: SeedService = app.get(SeedService);
  await seedService.runSeed();

  cron.schedule('1 0 0 * * *', async () => {
    const calendarService: CalendarService = app.get(CalendarService);
    await calendarService.addDayToAllUsers();
  });

  const options = new DocumentBuilder()
    .setTitle('Nest Api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

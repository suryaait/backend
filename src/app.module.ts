import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/task.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://surya:Surya2445%23@cluster0.obbf1no.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ProductsModule,
    MailModule,
  ],
  providers: [TasksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

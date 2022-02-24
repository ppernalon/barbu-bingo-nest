import { Module } from '@nestjs/common'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { PrismaService } from './prisma.service'

@Module({
  imports: [
    EventEmitterModule.forRoot()
  ],
  providers: [AppService, AppGateway, PrismaService],
})
export class AppModule {}

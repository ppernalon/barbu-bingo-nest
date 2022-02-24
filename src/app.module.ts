import { Module } from '@nestjs/common'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  imports: [
    EventEmitterModule.forRoot()
  ],
  providers: [AppService, AppGateway],
})
export class AppModule {}

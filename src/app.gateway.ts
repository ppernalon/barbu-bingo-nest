import { Injectable } from "@nestjs/common";
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AppService } from "./app.service";
import { OnEvent } from '@nestjs/event-emitter'

@WebSocketGateway(  {
    cors: {
        origin: '*',
    }
})
@Injectable()
export class AppGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;

    constructor(private appService: AppService) {}

    handleConnection(client: any, ...args: any[]) {
        this.server.emit('connection', {challenge: this.appService.getCurrentChallenge()})
    }

    @OnEvent('new.challenge')
    handleNewChallenge(payload: {newChallenge: string}){
        this.server.emit('new.challenge', {challenge: payload.newChallenge})
    }
}

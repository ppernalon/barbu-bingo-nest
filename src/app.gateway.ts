import { Injectable } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AppService } from "./app.service";
import { OnEvent } from '@nestjs/event-emitter'

@WebSocketGateway(  {
    cors: true,
})
@Injectable()
export class AppGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;

    constructor(private appService: AppService) {}

    handleConnection(client: any, ...args: any[]) {
        this.server.emit('connection', {challenge: this.appService.getCurrentChallenge(), date: this.appService.getDateCurrentChallenge()})
    }

    @SubscribeMessage('new.sharedChallenge')
    handleAddingSharedChallenge(@MessageBody() challengeName: string){
        this.appService.addSharedChallenge(challengeName)
    }

    @SubscribeMessage('skip.sharedChallenge')
    handleSkippingSharedChallenge(){
        this.appService.setNewChallengeInterval(this.appService.timeBetweenChallenge)
    }

    @OnEvent('new.challenge')
    handleNewChallenge(payload: {newChallenge: string, dateChallenge: number}){
        this.server.emit('new.challenge', {challenge: payload.newChallenge, date: payload.dateChallenge})
    }
}

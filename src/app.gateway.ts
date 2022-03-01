import { Injectable } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AppService } from "./app.service";
import { OnEvent } from '@nestjs/event-emitter'

@WebSocketGateway(  {
    cors: true,
})
@Injectable()
export class AppGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(private appService: AppService) {}

    handleConnection(client: any, ...args: any[]) {
        this.server.emit('connection', {
            challenge: this.appService.getCurrentChallenge(), 
            date: this.appService.getDateCurrentChallenge(),
            pastChallenges: this.appService.getUsedChallenge()
        })
    }

    @SubscribeMessage('new.sharedChallenge')
    handleAddingSharedChallenge(@MessageBody() challengeName: string){
        this.appService.addSharedChallenge(challengeName)
    }

    @SubscribeMessage('skip.sharedChallenge')
    handleSkippingSharedChallenge(){
        this.appService.setNewChallengeInterval(this.appService.timeBetweenChallenge, true)
    }

    @SubscribeMessage('start.bingo.front')
    handleStartingBingo(){
        this.appService.startGame()
    }

    @SubscribeMessage('stop.bingo.front')
    handleStopBingo(){
        this.appService.stopGame()
    }

    @OnEvent('stop.bingo')
    sendStopBingoToClient(){
        this.server.emit('stop.bingo.back')
    }

    @OnEvent('new.challenge')
    sendNewChallengeToClient(payload: {newChallenge: string, dateChallenge: number, pastChallenges: string[]}){
        this.server.emit('new.challenge', {
            challenge: payload.newChallenge, 
            date: payload.dateChallenge,
            pastChallenges: payload.pastChallenges
        })
    }
}

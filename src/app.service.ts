import { Injectable, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from './prisma.service'
import { PrismaClient, SharedChallenge } from '@prisma/client'

@Injectable()
export class AppService implements OnModuleInit {
  private currentChallenge: string
  private availableChallenges: string[]
  private usedChallenges: string[]
  private newChallengeInterval: NodeJS.Timer

  constructor(private eventEmitter: EventEmitter2, private prisma: PrismaService){}

  onModuleInit() {
      this.initChallenges()
      this.setNewChallengeInterval(5000)
  }

  setNewChallengeInterval(duration: number){
    this.setNewRandomChallenge()
    clearInterval(this.newChallengeInterval)
    this.newChallengeInterval = setInterval(() => {
      this.setNewRandomChallenge()
    }, duration)
  }

  getCurrentChallenge(): string {
    return this.currentChallenge
  }

  setCurrentChallenge(newChallenge: string) {
    this.currentChallenge = newChallenge
  }

  getAvailableChallenges(): string[] {
    return this.availableChallenges
  }

  getAvailableChallengesLength(): number {
    return this.availableChallenges.length
  }

  getAvailableChallengeAt(index: number){
    return this.availableChallenges[index]
  }

  removeAvailableChallengeAt(index: number){
    this.availableChallenges.splice(index, 1)
  }

  addAvailableChallenge(challengeToAdd: string){
    this.availableChallenges.push(challengeToAdd)
  }

  addUsedChallenge(usedChallenge: string) {
    this.usedChallenges.push(usedChallenge)
  }

  initChallenges(){
    this.availableChallenges = []
    this.allSharedChallenges().then(dataFromDb => {
      dataFromDb.forEach(challengeFromDb => {
        this.availableChallenges.push(challengeFromDb.name)  
      })
    })
    this.usedChallenges = []
  }

  setNewRandomChallenge() {
    const numberOfChallenge: number = this.getAvailableChallengesLength()
    if (numberOfChallenge > 0){
      const index: number = Math.floor(Math.random() * numberOfChallenge)
      const randomPickedChallenge: string = this.getAvailableChallengeAt(index)
      this.addUsedChallenge(this.getCurrentChallenge())
      this.removeAvailableChallengeAt(index)
      this.setCurrentChallenge(randomPickedChallenge)
      this.eventEmitter.emit('new.challenge', { newChallenge: this.currentChallenge })
    } else {
      this.initChallenges()
    }
  }

  async allSharedChallenges() {
    return this.prisma.sharedChallenge.findMany()
  }

  async addSharedChallenge(challengeName: string) {
    return this.prisma.sharedChallenge.create({
      data: {
        name: challengeName
      }
    })
  }
}

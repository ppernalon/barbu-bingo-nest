import { Injectable, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from './prisma.service'

@Injectable()
export class AppService implements OnModuleInit {
  private currentChallenge: string
  private dateCurrentChallenge: number
  private availableChallenges: string[]
  private usedChallenges: string[]
  private newChallengeInterval: NodeJS.Timer
  public timeBetweenChallenge: number = 10*60*1000 // 10 min

  constructor(private eventEmitter: EventEmitter2, private prisma: PrismaService){}

  onModuleInit() {
    this.availableChallenges = []
    this.usedChallenges = []
    this.currentChallenge = "Le bingo n'a pas démarré"
  }

  startGame() {
    this.currentChallenge = null
    this.resetChallenges()
    this.setNewChallengeInterval(this.timeBetweenChallenge)
  }

  stopGame(){
    clearInterval(this.newChallengeInterval)
    this.availableChallenges = []
    this.usedChallenges = []
    this.currentChallenge = "Le bingo n'a pas démarré"
    this.eventEmitter.emit('stop.bingo')
  }

  getDateCurrentChallenge(){
    return this.dateCurrentChallenge
  }

  getUsedChallenge(){
    return this.usedChallenges
  }

  setNewChallengeInterval(duration: number){
    // this.setNewRandomChallenge()
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
    this.dateCurrentChallenge = Date.now()
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

  resetChallenges(){
    this.currentChallenge = null
    this.availableChallenges = []
    this.allSharedChallenges().then(dataFromDb => {
      dataFromDb.forEach(challengeFromDb => {
        this.availableChallenges.push(challengeFromDb.name)  
      })
      this.usedChallenges = []
      this.pickRandomChallenge()
    })
  }

  pickRandomChallenge() {
    const numberOfChallenge: number = this.getAvailableChallengesLength()
    const index: number = Math.floor(Math.random() * numberOfChallenge)
    const randomPickedChallenge: string = this.getAvailableChallengeAt(index)
    if (this.getCurrentChallenge()) this.addUsedChallenge(this.getCurrentChallenge())
    this.removeAvailableChallengeAt(index)
    this.setCurrentChallenge(randomPickedChallenge)
    this.eventEmitter.emit('new.challenge', { 
      newChallenge: randomPickedChallenge, 
      dateChallenge: Date.now(),
      pastChallenges: this.usedChallenges
    })
  }

  setNewRandomChallenge() {
    const numberOfChallenge: number = this.getAvailableChallengesLength()
    if (numberOfChallenge > 0){
      this.pickRandomChallenge()
    } else {
      this.resetChallenges()
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

import { Injectable, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class AppService implements OnModuleInit {
  private currentChallenge: string
  private availableChallenges: string[]
  private usedChallenges: string[]

  constructor(private eventEmitter: EventEmitter2){}

  onModuleInit() {
      this.setCurrentChallenge("teeeeest")
      this.availableChallenges = ["on fait des test", "tranquillou"]
      this.usedChallenges = []
      setInterval(() => {
        this.setNewRandomChallenge()
        this.eventEmitter.emit('new.challenge', { newChallenge: this.currentChallenge })
      }, 5000)
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

  resetChallenges(){
    this.availableChallenges = [...this.usedChallenges]
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
    } else {
      this.resetChallenges()
      this.setNewRandomChallenge()
    }
  }
}

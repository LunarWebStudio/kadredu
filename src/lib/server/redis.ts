import { createClient } from "redis"
import { env } from "~/env"


// class Redis {
//   private readonly client = createClient({
//     url: env.REDIS_URL
//   })
//
//   constructor(){
//     this.client.connect()
//   }
//
//   async createAchievement(achievement: Achievement){
//     await this.client.HSET(
//       `achievements:${achievement.eventType}`,
//       [
//         achievement.id, achievement.eventAmount,
//       ])
//   } 
//
//   async countEvent(id:string, event: EventType, cb: (achievementId:string) => void){
//     const count = await this.client.incrBy(`user:${id}:${event}`, 1)
//
//     const hash = await this.client.hGetAll(`achievements:${event}`)
//     for (const key in hash){
//       if (Number(hash[key]) === count) cb(key)
//     }
//   }
//
//   async deleteAchievement(id:string, event: EventType){
//     await this.client.HDEL(`achievement:${event}`, id)
//   }
// }

const redis = createClient({
  url: env.REDIS_URL
})
redis.connect()

export { redis }

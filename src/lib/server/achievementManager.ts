import { z } from "zod"
import { redis } from "./redis"
import { AchievementSchema } from "~/lib/shared/types/achievements"
import { db } from "~/server/db"
import { EventType, achievements, recevedAchievements } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import { IdSchema } from "../shared/types/utils"



const t = z.intersection(AchievementSchema.omit({image:true}), z.object({imageId:z.string()}))
const UpdateSchema = z.intersection(AchievementSchema.merge(IdSchema).omit({image:true}), z.object({imageId:z.string().optional()}))

export class AchievementManager {
  async createAchievement(input: z.infer<typeof t>){
     const achievement = (await db
      .insert(achievements)
      .values({
        ...input
      }).returning())[0]!

      await redis.HSET(
        `achievements:${achievement.eventType}`,
        [
          achievement.id, achievement.eventAmount,
        ]
      )
  }

  async updateAchievement(input: z.infer<typeof UpdateSchema>){
    await db
      .update(achievements)
      .set({
        ...input,
      })
      .where(eq(achievements.id, input.id))

    await redis.HSET(
      `achievements:${input.eventType}`,
      input.id,
      input.eventAmount
    )
  }

  async countEvent(id:string, event:EventType){

    if(event === "CUSTOM") return

    const count = await redis.incrBy(`user:${id}:${event}`, 1)
    const hash = await redis.hGetAll(`achievements:${event}`)


    for (const key in hash){
      if (Number(hash[key]) === count){
        await db.insert(recevedAchievements)
          .values({
            userId: id,
            achievementId: key
          })
      }
    }
  }

  async deleteAchievement(id:string){
    const achievement = (await db.update(achievements)
      .set({
        isDeleted: true
      })
      .where(eq(achievements.id, id ))
      .returning())[0]!

    await redis.HDEL(`achievements:${achievement.eventType}`, id)
  }


}

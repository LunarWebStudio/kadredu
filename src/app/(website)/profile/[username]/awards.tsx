'use client'

import { Carousel } from "~/components/ui/carousel"
import { api } from "~/trpc/react"


// export function AwardsCarousel({username}:
//   {
//     username:string
//   }
// ){
//
//   const awards = api.achievements.getByUsername.useQuery({username})
//   console.log(awards)
//
//   return (
//     <Carousel>
//       {
//         awards.isPending ?
//           (
//             {awards.data.map()}
//           )
//         :
//           (
//             <h1>Loading...</h1>
//           )
//       }
//     </Carousel>
//   )
// }

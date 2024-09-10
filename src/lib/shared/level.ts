const BASE_XP = 100;
const INCREASE_PERCENTAGE = 1.1;

export default function GetLevel(experiencePoints: number): {
  level: number;
  xp_to_next_level: number;
} {
  let level = 1;
  let xp_to_next_level = BASE_XP;
  while (experiencePoints > xp_to_next_level) {
    level++;
    xp_to_next_level += Math.round(xp_to_next_level * INCREASE_PERCENTAGE);
  }
  return { level, xp_to_next_level };
}

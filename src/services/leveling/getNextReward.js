/**
 * Gets the next reward after the member's current level.
 *
 * @param {number} currentLevel
 * @param {{ level: number, roleId: string }[]} rewardRoles
 * @param {import("discord.js").Guild} guild
 *
 * @returns {{
 *   level: number,
 *   roleId: string,
 *   role: import("discord.js").Role | null,
 * } | null}
 */
module.exports = function getNextReward(currentLevel, rewardRoles = [], guild) {
  if (!rewardRoles.length) {
    return null;
  }

  const nextReward = [...rewardRoles]
    .filter((reward) => reward.level > currentLevel)
    .sort((a, b) => a.level - b.level)[0];

  if (!nextReward) {
    return null;
  }

  return {
    level: nextReward.level,
    roleId: nextReward.roleId,
    role: guild.roles.cache.get(nextReward.roleId) ?? null,
  };
};

/**
 * Awards level reward roles to a member.
 *
 * Returns ONLY the roles that were newly awarded during this call.
 *
 * @param {import("discord.js").GuildMember} member
 * @param {Object} settings
 * @param {number} currentLevel
 * @returns {Promise<import("discord.js").Role[]>}
 */
module.exports = async function levelRewardService(
  member,
  settings,
  currentLevel,
) {
  if (!member || !settings) return [];

  const awardedRoles = [];

  const rewards = [...settings.leveling.rewardRoles].sort(
    (a, b) => a.level - b.level,
  );

  if (!rewards.length) return awardedRoles;

  const earnedRewards = rewards.filter(
    (reward) => reward.level <= currentLevel,
  );

  // ==========================
  // Stack Mode
  // ==========================

  if (settings.leveling.rewardStacking) {
    for (const reward of earnedRewards) {
      const role = member.guild.roles.cache.get(reward.roleId);

      if (!role) continue;
      if (!role.editable) continue;

      // Already owns it → don't announce it again
      if (member.roles.cache.has(role.id)) continue;

      try {
        await member.roles.add(role, "Level reward");
        awardedRoles.push(role);
      } catch (err) {
        console.error(err);
      }
    }

    return awardedRoles;
  }

  // ==========================
  // Replace Mode
  // ==========================

  const highestReward = earnedRewards[earnedRewards.length - 1];

  // Remove every other reward role
  for (const reward of rewards) {
    if (highestReward && reward.roleId === highestReward.roleId) {
      continue;
    }

    const role = member.guild.roles.cache.get(reward.roleId);

    if (!role) continue;
    if (!role.editable) continue;
    if (!member.roles.cache.has(role.id)) continue;

    try {
      await member.roles.remove(role, "Updating level reward");
    } catch (err) {
      console.error(err);
    }
  }

  // No reward earned yet
  if (!highestReward) {
    return awardedRoles;
  }

  const highestRole = member.guild.roles.cache.get(highestReward.roleId);

  if (!highestRole) return awardedRoles;
  if (!highestRole.editable) return awardedRoles;

  // Only award if they don't already have it
  if (!member.roles.cache.has(highestRole.id)) {
    try {
      await member.roles.add(highestRole, "Level reward");
      awardedRoles.push(highestRole);
    } catch (err) {
      console.error(err);
    }
  }

  return awardedRoles;
};

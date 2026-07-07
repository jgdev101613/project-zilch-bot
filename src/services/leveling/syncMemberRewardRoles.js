module.exports = async function syncMemberRewardRoles(
  member,
  level,
  rewardRoles,
  rewardStacking,
) {
  const addedRoles = [];
  const removedRoles = [];

  const sortedRewards = [...rewardRoles].sort((a, b) => a.level - b.level);

  if (rewardStacking) {
    // User should own every reward below their level

    for (const reward of sortedRewards) {
      const role = member.guild.roles.cache.get(reward.roleId);

      if (!role) continue;

      if (level >= reward.level) {
        if (!member.roles.cache.has(role.id)) {
          await member.roles.add(role);

          addedRoles.push(role);
        }
      } else {
        if (member.roles.cache.has(role.id)) {
          await member.roles.remove(role);

          removedRoles.push(role);
        }
      }
    }
  } else {
    // User should only own ONE reward role

    let highestReward = null;

    for (const reward of sortedRewards) {
      if (level >= reward.level) {
        highestReward = reward;
      }
    }

    for (const reward of sortedRewards) {
      const role = member.guild.roles.cache.get(reward.roleId);

      if (!role) continue;

      if (highestReward && reward.roleId === highestReward.roleId) {
        if (!member.roles.cache.has(role.id)) {
          await member.roles.add(role);

          addedRoles.push(role);
        }
      } else {
        if (member.roles.cache.has(role.id)) {
          await member.roles.remove(role);

          removedRoles.push(role);
        }
      }
    }
  }

  return {
    addedRoles,
    removedRoles,
  };
};

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

  // =========================
  // Stack Mode
  // =========================

  if (settings.leveling.stackRewards) {
    for (const reward of earnedRewards) {
      const role = member.guild.roles.cache.get(reward.roleId);

      if (!role) continue;
      if (!role.editable) continue;
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

  // =========================
  // Replace Mode
  // =========================

  for (const reward of rewards) {
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

  const highestReward = earnedRewards[earnedRewards.length - 1];

  if (!highestReward) return awardedRoles;

  const role = member.guild.roles.cache.get(highestReward.roleId);

  if (!role) return awardedRoles;
  if (!role.editable) return awardedRoles;

  try {
    await member.roles.add(role, "Level reward");
    awardedRoles.push(role);
  } catch (err) {
    console.error(err);
  }

  return awardedRoles;
};

const parsePlaceholders = require("../../utils/parsePlaceholders");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const getNextReward = require("./getNextReward");

/**
 * Builds the final level-up message.
 *
 * @param {Object} options
 * @param {import("discord.js").GuildMember} options.member
 * @param {Object} options.settings
 * @param {number} options.previousLevel
 * @param {number} options.currentLevel
 * @param {number} options.currentXp
 * @param {number} options.totalXp
 * @param {number} options.rank
 * @param {import("discord.js").Role[]} options.awardedRoles
 *
 * @returns {string}
 */
module.exports = function buildLevelUpMessage({
  member,
  settings,

  previousLevel,
  currentLevel,

  currentXp,
  totalXp,

  rank = "N/A",

  awardedRoles = [],
}) {
  const template =
    settings.leveling.levelUpMessage?.trim() ||
    "🎉 Congratulations {user}!\n\nYou reached **Level {level}**!";

  // =====================================
  // Reward Information
  // =====================================

  let rewardText = "None";
  let nextRewardName = "No more rewards";
  let nextRewardLevel = "MAX";

  if (awardedRoles.length > 0) {
    rewardText = awardedRoles.map((role) => role.toString()).join(", ");
  }

  const nextReward = getNextReward(
    currentLevel,
    settings.leveling.rewardRoles,
    member.guild,
  );

  if (nextReward) {
    nextRewardName = nextReward.role
      ? nextReward.role.toString()
      : "Unknown Role";

    nextRewardLevel = nextReward.level;
  }

  const rewardCount = awardedRoles.length;

  const hasReward = rewardCount > 0;

  const hasNextReward = nextReward !== null;

  const nextRewardId = nextReward?.roleId ?? "N/A";

  const nextRewardRoleName = nextReward?.role?.name ?? "No more rewards";

  const rewardRoleNames = awardedRoles.length
    ? awardedRoles.map((role) => role.name).join(", ")
    : "None";

  // =====================================
  // Parse Placeholders
  // =====================================

  let content = parsePlaceholders(template, {
    user: `${member}`,

    "user.id": member.id,
    "user.name": member.user.username,
    "user.tag": member.user.tag,

    displayName: member.displayName,

    guild: member.guild.name,

    level: currentLevel,
    previousLevel,

    xp: currentXp,
    requiredXp: calculateLevelXp(currentLevel),

    totalXp,

    rank,

    reward: rewardText,
    rewards: rewardText,

    rewardCount,

    hasReward,

    nextReward: nextRewardName,
    nextRewardLevel,

    hasNextReward,

    nextRewardId,

    nextRewardRoleName,

    rewardRoleNames,

    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  // =====================================
  // Automatic Reward Section
  // =====================================

  // If the template already contains reward placeholders,
  // let the server owner control the layout completely.

  const rewardPlaceholders = [
    "{reward}",
    "{rewards}",
    "{nextReward}",
    "{nextRewardLevel}",
  ];

  const templateHandlesRewards = rewardPlaceholders.some((placeholder) =>
    template.toLowerCase().includes(placeholder.toLowerCase()),
  );

  if (!templateHandlesRewards) {
    if (awardedRoles.length > 0) {
      content +=
        "\n\n🏅 **New Reward" + (awardedRoles.length > 1 ? "s" : "") + "**";

      for (const role of awardedRoles) {
        content += `\n• ${role}`;
      }
    } else {
      content +=
        "\n\n🎯 **Next Reward**" +
        `\nLevel: **${nextRewardLevel}**` +
        `\nRole: ${nextRewardName}`;
    }
  }

  return content;
};

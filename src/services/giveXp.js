const Level = require("../models/levelSchema");
const calculateLevelXp = require("../utils/calculateLevelXp");
const levelRewardService = require("./levelRewardService");

const XP_SOURCES = require("../constants/xpSources");
const EMBED_TYPES = require("../constants/embedTypes");
const createEmbed = require("../utils/createEmbed");

/**
 * Gives XP to a guild member.
 *
 * @param {Object} options
 * @param {import("discord.js").Client} options.client
 * @param {import("discord.js").GuildMember} options.member
 * @param {Object} options.settings
 * @param {number} options.xp
 * @param {string} [options.source=XP_SOURCES.TEXT]
 * @param {import("discord.js").TextBasedChannel|null} [options.announceChannel=null]
 */
module.exports = async ({
  client,
  member,
  settings,
  xp,
  source = XP_SOURCES.TEXT,
  announceChannel = null,
}) => {
  let level = await Level.findOne({
    guildId: member.guild.id,
    userId: member.id,
  });

  if (!level) {
    level = new Level({
      guildId: member.guild.id,
      userId: member.id,
      xp: 0,
      totalXp: 0,
      level: 0,
    });
  }

  // ==========================
  // Previous Values
  // ==========================

  const previousLevel = level.level;
  const previousXp = level.xp;
  const previousTotalXp = level.totalXp;

  // ==========================
  // XP Multiplier
  // ==========================

  let xpToGive = xp;

  switch (source) {
    case XP_SOURCES.TEXT:
      xpToGive *= settings.leveling.text.xpMultiplier;
      break;

    case XP_SOURCES.VOICE:
      xpToGive *= settings.leveling.voice.xpMultiplier;
      break;

    case XP_SOURCES.DAILY:
      break;

    case XP_SOURCES.QUEST:
      break;

    case XP_SOURCES.ADMIN:
      break;

    case XP_SOURCES.EVENT:
      break;

    default:
      break;
  }

  xpToGive = Math.floor(xpToGive);

  // ==========================
  // Apply XP
  // ==========================

  level.xp += xpToGive;
  level.totalXp += xpToGive;
  level.displayName = member.displayName;
  level.avatarURL = member.displayAvatarURL({
    extension: "png",
    size: 256,
  });

  const levelsGained = [];

  while (level.xp >= calculateLevelXp(level.level)) {
    const requiredXp = calculateLevelXp(level.level);

    level.xp -= requiredXp;
    level.level++;

    levelsGained.push(level.level);
  }

  await level.save();

  // ==========================
  // Rewards
  // ==========================

  let awardedRoles = [];

  if (levelsGained.length > 0) {
    awardedRoles = await levelRewardService(member, settings, level.level);

    // ==========================
    // Announcement Channel
    // ==========================

    let channel = announceChannel;

    if (settings.leveling.levelUpChannel) {
      channel = await client.channels
        .fetch(settings.leveling.levelUpChannel)
        .catch(() => null);
    }

    if (channel?.isTextBased()) {
      let content;

      if (
        settings.leveling.levelUpMessage === "" ||
        settings.leveling.levelUpMessage === null
      ) {
        content = `🎉 ${member} has reached **Level ${level.level}**!`;
      } else {
        content = settings.leveling.levelUpMessage;
      }

      if (awardedRoles.length > 0) {
        content += `\n\n🏅 **New Reward${
          awardedRoles.length > 1 ? "s" : ""
        }:** ${awardedRoles.join(", ")}`;
      }

      const embed = createEmbed({
        type: EMBED_TYPES.LEVELUPMESSAGE,
        title: "Level Up!",
        description: content,
      });

      await channel.send({
        embeds: [embed],
      });
    }
  }

  // ==========================
  // Return Result
  // ==========================

  return {
    source,

    xpGained: xpToGive,

    previousLevel,
    currentLevel: level.level,

    previousXp,
    currentXp: level.xp,

    previousTotalXp,
    totalXp: level.totalXp,

    leveledUp: levelsGained.length > 0,

    levelsGained,

    awardedRoles,

    member,
  };
};

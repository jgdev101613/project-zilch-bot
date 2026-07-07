const Level = require("../models/levelSchema");
const calculateLevelXp = require("../utils/calculateLevelXp");
const levelRewardService = require("./levelRewardService");

const XP_SOURCES = require("../constants/xpSources");
const EMBED_TYPES = require("../constants/embedTypes");
const createEmbed = require("../utils/createEmbed");
const { options } = require("../commands/level/level");
const buildLevelUpMessage = require("./leveling/buildLevelUpMessage");
/**
 * Gives XP to a guild member safely and atomically.
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
  const maxRetries = 5;
  let attempt = 0;
  let success = false;

  // Variables to hold the final state after a successful atomic update
  let finalPreviousLevel, finalCurrentLevel;
  let finalPreviousXp, finalCurrentXp;
  let finalPreviousTotalXp, finalTotalXp;
  let finalLevelsGained = [];
  let finalXpGiven = 0;

  // ==========================
  // Atomic Calculation Loop
  // ==========================
  while (attempt < maxRetries && !success) {
    // 1. Atomically fetch or create the user's level document
    const level = await Level.findOneAndUpdate(
      { guildId: member.guild.id, userId: member.id },
      { $setOnInsert: { xp: 0, totalXp: 0, level: 0 } },
      { upsert: true, returnDocument: "after" },
    );

    const previousLevel = level.level;
    const previousXp = level.xp;
    const previousTotalXp = level.totalXp;

    // 2. Calculate XP Multiplier
    let xpToGive = xp;
    switch (source) {
      case XP_SOURCES.TEXT:
        xpToGive *= settings.leveling.text.xpMultiplier;
        break;
      case XP_SOURCES.VOICE:
        xpToGive *= settings.leveling.voice.xpMultiplier;
        break;
      // Other sources retain default xp
      default:
        break;
    }
    xpToGive = Math.floor(xpToGive);

    // 3. Apply XP to local variables
    let newXp = previousXp + xpToGive;
    let newTotalXp = previousTotalXp + xpToGive;
    let newLevel = previousLevel;
    const levelsGained = [];

    while (newXp >= calculateLevelXp(newLevel)) {
      const requiredXp = calculateLevelXp(newLevel);
      newXp -= requiredXp;
      newLevel++;
      levelsGained.push(newLevel);
    }

    // 4. Attempt atomic database update using Optimistic Concurrency Control
    const updateResult = await Level.updateOne(
      {
        _id: level._id,
        xp: previousXp, // Strict lock condition: Only update if XP hasn't
        totalXp: previousTotalXp, // been modified by another concurrent thread.
      },
      {
        $set: {
          xp: newXp,
          totalXp: newTotalXp,
          level: newLevel,
          displayName: member.displayName,
          avatarURL: member.displayAvatarURL({ extension: "png", size: 256 }),
        },
      },
    );

    // If matchedCount is 1, the document wasn't altered during our calculation.
    if (updateResult.matchedCount === 1) {
      success = true;
      finalPreviousLevel = previousLevel;
      finalCurrentLevel = newLevel;
      finalPreviousXp = previousXp;
      finalCurrentXp = newXp;
      finalPreviousTotalXp = previousTotalXp;
      finalTotalXp = newTotalXp;
      finalLevelsGained = levelsGained;
      finalXpGiven = xpToGive;
    } else {
      // Data was modified mid-calculation by another request. Retry.
      attempt++;
    }
  }

  // Fallback in case of extreme, sustained concurrency
  if (!success) {
    console.warn(
      `[Leveling] Dropped ${xp} XP for ${member.user.tag} due to high concurrency.`,
    );
    return null;
  }

  // ==========================
  // Rewards & Announcements
  // ==========================
  let awardedRoles = [];

  if (finalLevelsGained.length > 0) {
    awardedRoles = await levelRewardService(
      member,
      settings,
      finalCurrentLevel,
    );

    let channel = announceChannel;
    if (settings.leveling.levelUpChannel) {
      channel = await client.channels
        .fetch(settings.leveling.levelUpChannel)
        .catch(() => null);
    }

    if (channel?.isTextBased()) {
      const content = buildLevelUpMessage({
        member,
        settings,

        previousLevel: finalPreviousLevel,
        currentLevel: finalCurrentLevel,

        currentXp: finalCurrentXp,
        totalXp: finalTotalXp,

        awardedRoles,
      });

      const embed = createEmbed({
        type: EMBED_TYPES.LEVELUPMESSAGE,
        title: "Level Up!",
        description: content,
      });

      await channel.send({ embeds: [embed] }).catch(() => null);
    }
  }

  // ==========================
  // Return Result
  // ==========================
  return {
    source,
    xpGained: finalXpGiven,

    previousLevel: finalPreviousLevel,
    currentLevel: finalCurrentLevel,

    previousXp: finalPreviousXp,
    currentXp: finalCurrentXp,

    previousTotalXp: finalPreviousTotalXp,
    totalXp: finalTotalXp,

    leveledUp: finalLevelsGained.length > 0,
    levelsGained: finalLevelsGained,
    awardedRoles,
    member,
  };
};

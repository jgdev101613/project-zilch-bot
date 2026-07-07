// Rank Imports
const generateRankCard = require("../../../cards/rankCard");
const Level = require("../../../models/levelSchema");
const calculateLevelXp = require("../../../utils/calculateLevelXp");
const getGuildSettings = require("../../../services/guildSettings");

// Leaderboard Imports
const getLeaderboard = require("../../../services/leaderboard/getLeaderboard");
const getUserRank = require("../../../services/leaderboard/getUserRank");
const formatNumber = require("../../../cards/utils/formatNumber");
const leaderboardCard = require("../../../cards/leaderboardCard");

// Utils
const createEmbed = require("../../../utils/createEmbed");
const { EMBED_TYPES, UPDATE_TYPES } = require("../../../constants");

// Services
const syncMemberRewardRoles = require("../../../services/leveling/syncMemberRewardRoles");

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function guildLevelSync(client, interaction) {
  try {
    await interaction.deferReply();

    const settings = await getGuildSettings(interaction.guild.id);

    const levels = await Level.find({
      guildId: interaction.guild.id,
    });

    let updated = 0;

    for (const level of levels) {
      const member = await interaction.guild.members
        .fetch(level.userId)
        .catch(() => null);

      if (!member) continue;

      const result = await syncMemberRewardRoles(
        member,
        level.level,
        settings.leveling.rewardRoles,
        settings.leveling.rewardStacking,
      );

      if (result.addedRoles.length || result.removedRoles.length) {
        updated++;
      }
    }

    await interaction.editReply(
      `✅ Synchronization complete.\nUpdated ${updated} members.`,
    );
  } catch (error) {
    console.error(`[Error] Error in guildLevelSync function: ${error}`);
  }
}

module.exports = {
  guildLevelSync,
};

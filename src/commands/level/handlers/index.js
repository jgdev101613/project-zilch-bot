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
const EMBED_TYPES = require("../../../constants/embedTypes");
const UPDATE_TYPES = require("../../../constants/updateTypes");

// Services
const syncMemberRewardRoles = require("../../../services/leveling/syncMemberRewardRoles");
const embedTypes = require("../../../constants/embedTypes");

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function rank(client, interaction) {
  try {
    await interaction.deferReply();
    const target = interaction.options.getUser("user") ?? interaction.user;
    const settings = await getGuildSettings(interaction.guild.id);
    const member = await interaction.guild.members.fetch(target.id);

    let levelData = await Level.findOne({
      guildId: interaction.guild.id,
      userId: target.id,
    });

    if (!levelData) {
      levelData = {
        level: 0,
        xp: 0,
        totalXp: 0,
      };
    }

    const requiredXp = calculateLevelXp(levelData.level);

    const rank =
      (await Level.countDocuments({
        guildId: interaction.guild.id,
        totalXp: { $gt: levelData.totalXp },
      })) + 1;

    const image = await generateRankCard({
      avatarURL: target.displayAvatarURL({
        extension: "png",
        size: 512,
      }),

      username: target.username,

      displayName: member.displayName ?? target.globalName ?? target.username,

      level: levelData.level,

      rank,

      currentXp: levelData.xp,

      requiredXp,

      totalXp: levelData.totalXp,

      theme: settings.settings.theme,
    });

    await interaction.editReply({
      files: [
        {
          attachment: image,
          name: "rank.png",
        },
      ],
    });
  } catch (error) {
    console.error(`[Error] Error in rank function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function leaderboard(client, interaction) {
  try {
    await interaction.deferReply();

    const settings = await getGuildSettings(interaction.guild.id);

    const leaderboard = await getLeaderboard(interaction.guild.id, 1, 10);

    const yourRank = await getUserRank(
      interaction.guild.id,
      interaction.user.id,
    );

    const image = await leaderboardCard({
      guildName: interaction.guild.name,

      guildIcon: interaction.guild.iconURL({
        extension: "png",
        size: 256,
      }),

      currentPage: leaderboard.currentPage,
      totalPages: leaderboard.totalPages,

      users: leaderboard.users,

      yourRank,

      theme: settings.settings.theme,
    });

    await interaction.editReply({
      files: [
        {
          attachment: image,
          name: "leaderboard.png",
        },
      ],
    });
  } catch (error) {
    console.error(`[Error] Error in rank function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function rankSync(client, interaction) {
  try {
    await interaction.deferReply();

    const user = interaction.options.getUser("user") ?? interaction.user;

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.editReply("That member is not in this server.");
    }

    const settings = await getGuildSettings(interaction.guild.id);

    const levelData = await Level.findOne({
      guildId: interaction.guild.id,
      userId: user.id,
    });

    if (!levelData) {
      return interaction.editReply("This user has no level data.");
    }

    const result = await syncMemberRewardRoles(
      member,
      levelData.level,
      settings.leveling.rewardRoles,
      settings.leveling.rewardStacking,
    );

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.SYNC,
      description:
        `✅ Synced **${user}**\n\n` +
        `Added: ${result.addedRoles.length}\n` +
        `Removed: ${result.removedRoles.length}`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in rankSync function: ${error}`);
  }
}

module.exports = {
  rank,
  leaderboard,
  rankSync,
};

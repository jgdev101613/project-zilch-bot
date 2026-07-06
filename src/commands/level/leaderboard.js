const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const getLeaderboard = require("../../services/leaderboard/getLeaderboard");
const getUserRank = require("../../services/leaderboard/getUserRank");
const formatNumber = require("../../cards/utils/formatNumber");
const leaderboardCard = require("../../cards/leaderboardCard");

const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "leaderboard",
  description: "View the server leveling leaderboard.",

  options: [
    {
      name: "page",
      description: "Leaderboard page.",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      min_value: 1,
    },
  ],

  callback: async (client, interaction) => {
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
  },
};

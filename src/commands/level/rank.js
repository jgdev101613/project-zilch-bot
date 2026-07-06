const { ApplicationCommandOptionType } = require("discord.js");

const generateRankCard = require("../../cards/rankCard");
const Level = require("../../models/levelSchema");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "rank",
  description: "View your rank or another member's rank.",

  options: [
    {
      name: "user",
      description: "The member whose rank you want to view.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  callback: async (client, interaction) => {
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
  },
};

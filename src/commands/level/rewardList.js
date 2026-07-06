const GuildSettings = require("../../models/guildSettingsSchema");
const {
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "rewardlist",
  description: "Displays all configured level rewards.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    const rewards = [...settings.leveling.rewardRoles].sort(
      (a, b) => a.level - b.level,
    );

    if (!rewards.length) {
      return interaction.editReply({
        content: "❌ No level rewards have been configured yet.",
      });
    }

    const description = rewards
      .map((reward) => {
        const role = interaction.guild.roles.cache.get(reward.roleId);

        return `**Level ${reward.level}** → ${
          role ? role.toString() : "`Deleted Role`"
        }`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🏅 Level Rewards")
      .setDescription(description)
      .setFooter({
        text: `Total Rewards: ${rewards.length}`,
      })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
    });
  },
};

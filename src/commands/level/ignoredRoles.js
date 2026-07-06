const {
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "ignoredroles",
  description: "Shows all ignored text leveling roles.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const settings = await getGuildSettings(interaction.guild.id);

    if (!settings || settings.leveling.text.ignoredRoles.length === 0) {
      return interaction.editReply({
        content: "No ignored roles.",
      });
    }

    const roles = settings.leveling.text.ignoredRoles
      .map((id) => `<@&${id}>`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🚫 Ignored Roles")
      .setDescription(roles)
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
    });
  },
};

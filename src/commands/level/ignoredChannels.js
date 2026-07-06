const {
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "ignoredchannels",
  description: "Shows all ignored text leveling channels.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const settings = await getGuildSettings(interaction.guild.id);

    if (!settings || settings.leveling.text.ignoredChannels.length === 0) {
      return interaction.editReply({
        content: "No ignored channels.",
      });
    }

    const channels = settings.leveling.text.ignoredChannels
      .map((id) => `<#${id}>`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🚫 Ignored Channels")
      .setDescription(channels);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};

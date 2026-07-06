const GuildSettings = require("../../models/guildSettingsSchema");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "leveling",
  description: "Enable or disable the leveling system.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "enabled",
      description: "Enable or disable leveling.",
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const enabled = interaction.options.getBoolean("enabled");

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    settings.leveling.enabled = enabled;

    await settings.save();

    await interaction.editReply({
      content: enabled
        ? "✅ Leveling has been **enabled**."
        : "⛔ Leveling has been **disabled**.",
    });
  },
};

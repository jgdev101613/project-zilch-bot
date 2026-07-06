const GuildSettings = require("../../models/guildSettingsSchema");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "rewardstack",
  description: "Configure how level reward roles are awarded.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "enabled",
      description: "Enable Stack Mode (true) or Replace Mode (false).",
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

    settings.leveling.stackRewards = enabled;

    await settings.save();

    await interaction.editReply({
      content: enabled
        ? "✅ **Stack Mode** has been enabled.\nMembers will keep every reward role they unlock."
        : "✅ **Replace Mode** has been enabled.\nMembers will only keep their highest unlocked reward role.",
    });
  },
};

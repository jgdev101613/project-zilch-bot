const GuildSettings = require("../../models/guildSettingsSchema");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "setcooldown",
  description: "Sets the XP cooldown between messages.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "seconds",
      description: "Cooldown in seconds.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 0,
      maxValue: 3600,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const seconds = interaction.options.getInteger("seconds");

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    settings.leveling.text.cooldown = seconds * 1000;

    await settings.save();

    await interaction.editReply({
      content:
        `✅ XP cooldown updated.\n\n` +
        `**Cooldown:** ${seconds} second${seconds === 1 ? "" : "s"}`,
    });
  },
};

const GuildSettings = require("../../models/guildSettingsSchema");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "setmultiplier",
  description: "Sets the Text XP multiplier for this server.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "multiplier",
      description: "XP Multiplier (Example: 1, 1.5, 2, 3)",
      type: ApplicationCommandOptionType.Number,
      required: true,
      minValue: 0.1,
      maxValue: 10,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const multiplier = interaction.options.getNumber("multiplier");

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    settings.leveling.text.xpMultiplier = multiplier;

    await settings.save();

    await interaction.editReply({
      content:
        `✅ XP multiplier updated.\n\n` +
        `Current Multiplier: **${multiplier}x**`,
    });
  },
};

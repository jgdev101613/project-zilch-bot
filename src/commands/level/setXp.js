const GuildSettings = require("../../models/guildSettingsSchema");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "setxp",
  description: "Sets the minimum and maximum XP awarded per message.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "minimum",
      description: "Minimum XP per message.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 1,
    },
    {
      name: "maximum",
      description: "Maximum XP per message.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 1,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const minXp = interaction.options.getInteger("minimum");
    const maxXp = interaction.options.getInteger("maximum");

    if (minXp > maxXp) {
      return interaction.editReply({
        content: "❌ The minimum XP cannot be greater than the maximum XP.",
      });
    }

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    settings.leveling.text.minXp = minXp;
    settings.leveling.text.maxXp = maxXp;

    await settings.save();

    await interaction.editReply({
      content:
        `✅ XP reward updated.\n\n` +
        `**Minimum XP:** ${minXp}\n` +
        `**Maximum XP:** ${maxXp}`,
    });
  },
};

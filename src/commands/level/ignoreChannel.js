const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "ignorechannel",
  description: "Prevent users from earning XP in a channel.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "channel",
      description: "Channel to ignore.",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.options.getChannel("channel");

    const settings = await getGuildSettings(interaction.guild.id);

    if (settings.leveling.text.ignoredChannels.includes(channel.id)) {
      return interaction.editReply({
        content: `${channel} is already ignored.`,
      });
    }

    settings.leveling.text.ignoredChannels.push(channel.id);

    await settings.save();

    await interaction.editReply({
      content: `✅ ${channel} has been added to ignored channels.`,
    });
  },
};

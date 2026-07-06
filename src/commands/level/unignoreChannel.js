const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "unignorechannel",
  description: "Allow users to earn XP in a text channel again.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "channel",
      description: "Channel to remove.",
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

    if (!settings) {
      return interaction.editReply({
        content: "No leveling settings found.",
      });
    }

    const index = settings.leveling.text.ignoredChannels.indexOf(channel.id);

    if (index === -1) {
      return interaction.editReply({
        content: `${channel} isn't ignored.`,
      });
    }

    settings.leveling.text.ignoredChannels.splice(index, 1);

    await settings.save();

    await interaction.editReply({
      content: `✅ ${channel} has been removed from ignored channels.`,
    });
  },
};

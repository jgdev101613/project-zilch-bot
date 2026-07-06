const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const GuildSettings = require("../../models/guildSettingsSchema");

module.exports = {
  name: "setlevelchannel",
  description: "Sets the channel where level-up messages will be sent.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],

  options: [
    {
      name: "channel",
      description: "The channel for level-up messages.",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: false,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.options.getChannel("channel");

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    if (!channel) {
      settings.leveling.levelUpChannel = null;

      await settings.save();

      return interaction.editReply({
        content:
          "✅ Level-up messages will now be sent in the channel where the user levels up.",
      });
    }

    settings.leveling.levelUpChannel = channel.id;

    await settings.save();

    await interaction.editReply({
      content: `✅ Level-up messages will now be sent in ${channel}.`,
    });
  },
};

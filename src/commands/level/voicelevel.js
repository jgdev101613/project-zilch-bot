const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
  ChannelType,
} = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");
const createEmbed = require("../../utils/createEmbed");
const EMBED_TYPES = require("../../constants/embedTypes");

async function handleEnable(client, interaction, settings) {
  const enabled = interaction.options.getBoolean("enabled");

  settings.leveling.voice.enabled = enabled;

  await settings.save();

  const embed = createEmbed({
    type: EMBED_TYPES.SUCCESS,
    title: "Voice Leveling Updated",
    description: `Voice leveling has been **${enabled ? "enabled" : "disabled"}**.`,
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

async function handleXp(client, interaction, settings) {
  const min = interaction.options.getInteger("min");
  const max = interaction.options.getInteger("max");

  if (min > max) {
    return interaction.editReply({
      embeds: [
        createErrorEmbed(
          "Invalid XP Range",
          "Minimum XP cannot be greater than maximum XP.",
        ),
      ],
    });
  }

  settings.leveling.voice.minXp = min;
  settings.leveling.voice.maxXp = max;

  await settings.save();

  const embed = createEmbed({
    type: EMBED_TYPES.SUCCESS,
    title: "Voice XP Updated",
    description: "The voice XP range has been updated successfully.",
    fields: [
      {
        name: "Minimum XP",
        value: `${min}`,
        inline: true,
      },
      {
        name: "Maximum XP",
        value: `${max}`,
        inline: true,
      },
    ],
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

async function handleCooldown(client, interaction, settings) {
  const seconds = interaction.options.getInteger("seconds");

  settings.leveling.voice.cooldown = seconds * 1000;

  await settings.save();

  const embed = createEmbed({
    type: EMBED_TYPES.SUCCESS,
    title: "Voice Cooldown Updated",
    description: "The voice XP cooldown has been updated successfully.",
    fields: [
      {
        name: "Cooldown",
        value: `${seconds} second${seconds === 1 ? "" : "s"}`,
        inline: true,
      },
    ],
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

async function handleMultiplier(client, interaction, settings) {
  const value = interaction.options.getNumber("value");

  settings.leveling.voice.xpMultiplier = value;

  await settings.save();

  const embed = createEmbed({
    type: "SUCCESS",
    title: "Voice XP Multiplier Updated",
    description: "The voice XP multiplier has been updated successfully.",
    fields: [
      {
        name: "Multiplier",
        value: `${value}x`,
        inline: true,
      },
    ],
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

async function handleMinimumUsers(client, interaction, settings) {
  const count = interaction.options.getInteger("count");

  settings.leveling.voice.minimumUsers = count;

  await settings.save();

  const embed = createEmbed({
    type: "SUCCESS",
    title: "Minimum Users Updated",
    description:
      "The minimum number of users required to earn voice XP has been updated.",
    fields: [
      {
        name: "Minimum Users",
        value: `${count}`,
        inline: true,
      },
    ],
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

async function handleIgnoredChannel(client, interaction, settings) {
  const channel = interaction.options.getChannel("channel");

  const ignoredChannels = settings.leveling.voice.ignoredChannels;

  const index = ignoredChannels.indexOf(channel.id);

  let action;

  if (index === -1) {
    ignoredChannels.push(channel.id);
    action = "added to";
  } else {
    ignoredChannels.splice(index, 1);
    action = "removed from";
  }

  await settings.save();

  const embed = createEmbed({
    type: "SUCCESS",
    title: "Ignored Channels Updated",
    description: `${channel} has been **${action}** the ignored voice channels.`,
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

async function handleIgnoredRole(client, interaction, settings) {
  const role = interaction.options.getRole("role");

  const ignoredRoles = settings.leveling.voice.ignoredRoles;

  const index = ignoredRoles.indexOf(role.id);

  let action;

  if (index === -1) {
    ignoredRoles.push(role.id);
    action = "added to";
  } else {
    ignoredRoles.splice(index, 1);
    action = "removed from";
  }

  await settings.save();

  const embed = createEmbed({
    type: "SUCCESS",
    title: "Ignored Roles Updated",
    description: `${role} has been **${action}** the ignored voice roles.`,
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

async function handleSettings(client, interaction, settings) {
  const ignoredChannels =
    settings.leveling.voice.ignoredChannels.length > 0
      ? settings.leveling.voice.ignoredChannels
          .map((id) => `<#${id}>`)
          .join(", ")
      : "`None`";

  const ignoredRoles =
    settings.leveling.voice.ignoredRoles.length > 0
      ? settings.leveling.voice.ignoredRoles.map((id) => `<@&${id}>`).join(", ")
      : "`None`";

  const embed = createEmbed({
    type: "INFO",
    title: "Voice Level Settings",
    description: "Current voice leveling configuration.",
    fields: [
      {
        name: "Status",
        value: settings.leveling.voice.enabled ? "🟢 Enabled" : "🔴 Disabled",
        inline: true,
      },
      {
        name: "XP Range",
        value: `${settings.leveling.voice.minXp} - ${settings.leveling.voice.maxXp}`,
        inline: true,
      },
      {
        name: "Multiplier",
        value: `${settings.leveling.voice.xpMultiplier}x`,
        inline: true,
      },
      {
        name: "Cooldown",
        value: `${settings.leveling.voice.cooldown / 1000}s`,
        inline: true,
      },
      {
        name: "Minimum Users",
        value: `${settings.leveling.voice.minimumUsers}`,
        inline: true,
      },
      {
        name: "Ignored Channels",
        value: ignoredChannels,
      },
      {
        name: "Ignored Roles",
        value: ignoredRoles,
      },
    ],
  });

  await interaction.editReply({
    embeds: [embed],
  });
}

module.exports = {
  name: "voicelevel",
  description: "Configure the voice leveling system.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],

  options: [
    {
      name: "enable",
      description: "Enable or disable voice leveling.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "enabled",
          description: "Enable or disable voice leveling.",
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
      ],
    },

    {
      name: "xp",
      description: "Configure voice XP range.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "min",
          description: "Minimum XP.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          minValue: 1,
        },
        {
          name: "max",
          description: "Maximum XP.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          minValue: 1,
        },
      ],
    },

    {
      name: "cooldown",
      description: "Configure voice XP cooldown.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "seconds",
          description: "Cooldown in seconds.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          minValue: 5,
        },
      ],
    },

    {
      name: "multiplier",
      description: "Configure voice XP multiplier.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "value",
          description: "XP multiplier.",
          type: ApplicationCommandOptionType.Number,
          required: true,
          minValue: 0.1,
        },
      ],
    },

    {
      name: "minimumusers",
      description: "Minimum users required in a voice channel.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "count",
          description: "Minimum number of users.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          minValue: 1,
        },
      ],
    },

    {
      name: "ignoredchannel",
      description: "Ignore or unignore a voice channel.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "Voice channel.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
          channelTypes: [ChannelType.GuildVoice, ChannelType.GuildStageVoice],
        },
      ],
    },

    {
      name: "ignoredrole",
      description: "Ignore or unignore a role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "Role.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },

    {
      name: "settings",
      description: "View current voice leveling settings.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const settings = await getGuildSettings(interaction.guild.id);

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "enable":
        return handleEnable(client, interaction, settings);

      case "xp":
        return handleXp(client, interaction, settings);

      case "cooldown":
        return handleCooldown(client, interaction, settings);

      case "multiplier":
        return handleMultiplier(client, interaction, settings);

      case "minimumusers":
        return handleMinimumUsers(client, interaction, settings);

      case "ignoredchannel":
        return handleIgnoredChannel(client, interaction, settings);

      case "ignoredrole":
        return handleIgnoredRole(client, interaction, settings);

      case "settings":
        return handleSettings(client, interaction, settings);
    }
  },
};

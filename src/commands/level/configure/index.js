const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
  ChannelType,
} = require("discord.js");

const getGuildSettings = require("../../../services/guildSettings");
const createEmbed = require("../../../utils/createEmbed");
const EMBED_TYPES = require("../../../constants/embedTypes");
const UPDATE_TYPES = require("../../../constants/updateTypes");

// ==========================
// VOICE
// ==========================

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceEnable(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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
  } catch (error) {
    console.error(`[Error] Error in handleVoiceEnable function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceXp(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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
  } catch (error) {
    console.error(`[Error] Error in handleVoiceXp function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceCooldown(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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
  } catch (error) {
    console.error(`[Error] Error in handleVoiceCooldown function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceMultiplier(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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
  } catch (error) {
    console.error(`[Error] Error in handleVoiceMultiplier function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceMinimumUsers(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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
  } catch (error) {
    console.error(`[Error] Error in handleVoiceMinimumUser function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceIgnoredChannel(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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
  } catch (error) {
    console.error(
      `[Error] Error in handleVoiceIgnoredChannel function: ${error}`,
    );
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceIgnoredRole(client, interaction, settings) {
  try {
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
  } catch (error) {
    console.error(`[Error] Error in handleVoiceIgnoredRole function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleVoiceSettings(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const ignoredChannels =
      settings.leveling.voice.ignoredChannels.length > 0
        ? settings.leveling.voice.ignoredChannels
            .map((id) => `<#${id}>`)
            .join(", ")
        : "`None`";

    const ignoredRoles =
      settings.leveling.voice.ignoredRoles.length > 0
        ? settings.leveling.voice.ignoredRoles
            .map((id) => `<@&${id}>`)
            .join(", ")
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
  } catch (error) {
    console.error(`[Error] Error in handleVoiceSettings function: ${error}`);
  }
}

// ==========================
// TEXT
// ==========================

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTextEnable(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const enabled = interaction.options.getBoolean("enabled");

    settings.leveling.text.enabled = enabled;

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: `Text leveling has been **${enabled ? "enabled" : "disabled"}**.`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in handleEnable function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTextXp(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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

    settings.leveling.text.minXp = min;
    settings.leveling.text.maxXp = max;

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: "The text XP range has been updated successfully.",
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
  } catch (error) {
    console.error(`[Error] Error in handleXp function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTextCooldown(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const seconds = interaction.options.getInteger("seconds");

    settings.leveling.text.cooldown = seconds * 1000;

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: "The text XP cooldown has been updated successfully.",
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
  } catch (error) {
    console.error(`[Error] Error in handleCooldown function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTextMultiplier(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const value = interaction.options.getNumber("value");

    settings.leveling.text.xpMultiplier = value;

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: "The text XP multiplier has been updated successfully.",
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
  } catch (error) {
    console.error(`[Error] Error in handleMultiplier function: ${error}`);
  }
}

async function handleTextMinimumMessageLength(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const count = interaction.options.getInteger("count");

    settings.leveling.text.minimumMessageLength = count;

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description:
        "The minimum message length required to earn text XP has been updated.",
      fields: [
        {
          name: "Minimum Message Length (Word)",
          value: `${count}`,
          inline: true,
        },
      ],
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(
      `[Error] Error in handleMinimumMessageLength function: ${error}`,
    );
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTextIgnoredChannel(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.options.getChannel("channel");

    const ignoredChannels = settings.leveling.text.ignoredChannels;

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
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: `${channel} has been **${action}** the ignored voice channels.`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in handleIgnoredChannel function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTextIgnoredRole(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const role = interaction.options.getRole("role");

    const ignoredRoles = settings.leveling.text.ignoredRoles;

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
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: `${role} has been **${action}** the ignored voice roles.`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in handleIgnoredRole function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function handleTextSettings(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const ignoredChannels =
      settings.leveling.text.ignoredChannels.length > 0
        ? settings.leveling.voice.ignoredChannels
            .map((id) => `<#${id}>`)
            .join(", ")
        : "`None`";

    const ignoredRoles =
      settings.leveling.text.ignoredRoles.length > 0
        ? settings.leveling.voice.ignoredRoles
            .map((id) => `<@&${id}>`)
            .join(", ")
        : "`None`";

    const embed = createEmbed({
      type: EMBED_TYPES.INFO,
      title: "Levelling Module Settings",
      description: "Current text leveling configuration.",
      fields: [
        {
          name: "Status",
          value: settings.leveling.text.enabled ? "🟢 Enabled" : "🔴 Disabled",
          inline: true,
        },
        {
          name: "XP Range",
          value: `${settings.leveling.text.minXp} - ${settings.leveling.text.maxXp}`,
          inline: true,
        },
        {
          name: "Multiplier",
          value: `${settings.leveling.text.xpMultiplier}x`,
          inline: true,
        },
        {
          name: "Cooldown",
          value: `${settings.leveling.text.cooldown / 1000}s`,
          inline: true,
        },
        {
          name: "Minimum Users",
          value: `${settings.leveling.text.minimumMessageLength}`,
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
  } catch (error) {
    console.error(`[Error] Error in handleSettings function: ${error}`);
  }
}

module.exports = {
  handleVoiceEnable,
  handleVoiceXp,
  handleVoiceCooldown,
  handleVoiceMultiplier,
  handleVoiceMinimumUsers,
  handleVoiceMinimumUsers,
  handleVoiceIgnoredChannel,
  handleVoiceIgnoredRole,
  handleVoiceSettings,

  handleTextEnable,
  handleTextXp,
  handleTextCooldown,
  handleTextMultiplier,
  handleTextMinimumMessageLength,
  handleTextIgnoredChannel,
  handleTextIgnoredRole,
  handleTextSettings,
};

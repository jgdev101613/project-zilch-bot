const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
  ChannelType,

  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const getGuildSettings = require("../../../services/guildSettings");
const createEmbed = require("../../../utils/createEmbed");
const { EMBED_TYPES, UPDATE_TYPES } = require("../../../constants");

const { DEFAULT_MESSAGES } = require("../../../constants");

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
      const embed = createEmbed({
        type: EMBED_TYPES.ERROR,
        title: UPDATE_TYPES.LEVELINGUPDATE,
        description: `Invalid XP Range, Minimum XP cannot be greater than maximum XP.`,
      });
      return interaction.editReply({
        embeds: [embed],
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
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

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
          value: settings.leveling.voice.enabled ? "Enabled" : "Disabled",
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
      image: "https://ik.imagekit.io/projectzilch/VoiceSettings.png",
      thumbnail: client.user.avatarURL(),
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
      const embed = createEmbed({
        type: EMBED_TYPES.ERROR,
        title: UPDATE_TYPES.LEVELINGUPDATE,
        description: `Invalid XP Range, Minimum XP cannot be greater than maximum XP.`,
      });
      return interaction.editReply({
        embeds: [embed],
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
        ? settings.leveling.text.ignoredChannels
            .map((id) => `<#${id}>`)
            .join(", ")
        : "`None`";

    const ignoredRoles =
      settings.leveling.text.ignoredRoles.length > 0
        ? settings.leveling.text.ignoredRoles
            .map((id) => `<@&${id}>`)
            .join(", ")
        : "`None`";

    const embed = createEmbed({
      type: EMBED_TYPES.INFO,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: "Current text leveling configuration.",
      fields: [
        {
          name: "Status",
          value: settings.leveling.text.enabled ? "Enabled" : "Disabled",
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
          name: "Minimum Message Length",
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
      image: "https://ik.imagekit.io/projectzilch/TextSettings.png",
      thumbnail: client.user.avatarURL(),
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in handleSettings function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function configureRewardAdd(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const level = interaction.options.getInteger("level");

    const role = interaction.options.getRole("role");

    const exists = settings.leveling.rewardRoles.find((r) => r.level === level);

    if (exists) {
      exists.roleId = role.id;
    } else {
      settings.leveling.rewardRoles.push({
        level,
        roleId: role.id,
      });
    }

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: `Level **${level}** now rewards ${role}.`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in configureRewardAdd function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function configureRewardList(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const rewards = [...settings.leveling.rewardRoles].sort(
      (a, b) => a.level - b.level,
    );

    if (!rewards.length) {
      return interaction.editReply({
        content: "No level rewards have been configured yet.",
      });
    }

    const description = rewards
      .map((reward) => {
        const role = interaction.guild.roles.cache.get(reward.roleId);

        return `**Level ${reward.level}** → ${
          role ? role.toString() : "`Deleted Role`"
        }`;
      })
      .join("\n");

    const embed = createEmbed({
      type: EMBED_TYPES.INFO,
      title: "🏅 Level Rewards",
      description: description,
      footer: `Total Rewards: ${rewards.length}`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in configureRewardList function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function configureRewardRemove(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const level = interaction.options.getInteger("level");

    const rewardIndex = settings.leveling.rewardRoles.findIndex(
      (reward) => reward.level === level,
    );

    if (rewardIndex === -1) {
      return interaction.editReply(
        `No reward is configured for **Level ${level}**.`,
      );
    }

    const removedReward = settings.leveling.rewardRoles[rewardIndex];

    settings.leveling.rewardRoles.splice(rewardIndex, 1);

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: `Successfully removed the reward for **Level ${level}** (<@&${removedReward.roleId}>).`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in configureRewardRemove function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function configureRewardStack(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const enabled = interaction.options.getBoolean("enabled");

    settings.leveling.stackRewards = enabled;

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: enabled
        ? "**Stack Mode** has been enabled.\nMembers will keep every reward role they unlock."
        : "**Replace Mode** has been enabled.\nMembers will only keep their highest unlocked reward role.",
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(`[Error] Error in configureRewardStack function: ${error}`);
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function configureSetLevelChannel(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.options.getChannel("channel");

    if (!channel) {
      settings.leveling.levelUpChannel = null;

      await settings.save();

      const embed = createEmbed({
        type: EMBED_TYPES.SUCCESS,
        title: UPDATE_TYPES.LEVELINGUPDATE,
        description: `Level-up messages will now be sent in the channel where the user levels up.`,
      });

      return interaction.editReply({
        embeds: [embed],
      });
    }

    settings.leveling.levelUpChannel = channel.id;

    await settings.save();

    const embed = createEmbed({
      type: EMBED_TYPES.SUCCESS,
      title: UPDATE_TYPES.LEVELINGUPDATE,
      description: `Level-up messages will now be sent in ${channel}.`,
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(
      `[Error] Error in configureSetLevelChannel function: ${error}`,
    );
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function configureSetLevelUpMessage(client, interaction, settings) {
  try {
    const modal = new ModalBuilder()
      .setCustomId("configure-level-message")
      .setTitle("Configure Level-Up Message");

    const messageInput = new TextInputBuilder()
      .setCustomId("message")
      .setLabel("Level-Up Message")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(4000)
      .setValue(
        settings.leveling.levelUpMessage ??
          DEFAULT_MESSAGES.DEFAULT_LEVEL_MESSAGE,
      );

    modal.addComponents(new ActionRowBuilder().addComponents(messageInput));

    await interaction.showModal(modal);
  } catch (error) {
    console.error(
      `[Error] Error in configureSetLevelUpMessage function: ${error}`,
    );
  }
}

/**
 * @param {import("discord.js").Client}  client
 * @param {import("discord.js").Interaction} interaction
 */
async function configurePlaceholderView(client, interaction, settings) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const embed = createEmbed({
      type: EMBED_TYPES.INFO,
      title: "Level-Up Message Placeholders",
      description:
        "These placeholders can be used in your custom level-up message.\n\nType `/level configure level-up-message` to edit level-up message",
      fields: [
        {
          name: "User",
          value:
            "`{user}` → Mentions the user\n" +
            "`{user.tag}` → Username with discriminator (or username)\n" +
            "`{username}` → Username\n" +
            "`{displayName}` → Server nickname",
        },
        {
          name: "Level",
          value:
            "`{level}` → Current level\n" +
            "`{xp}` → Current XP\n" +
            "`{requiredXp}` → XP required for next level\n" +
            "`{totalXp}` → Total accumulated XP",
        },
        {
          name: "Next Reward",
          value:
            "`{nextReward}` → Formatted next reward text\n" +
            "`{nextRewardRole}` → Next reward role\n" +
            "`{nextRewardLevel}` → Required level",
        },
        {
          name: "Server",
          value: "`{guild}` → Server name\n" + "`{memberCount}` → Member count",
        },
        {
          name: "Date & Time",
          value: "`{date}` → Current date\n" + "`{time}` → Current time",
        },
      ],
      footer:
        "Use this placeholder value to customize level-up notification message",
      image: "https://ik.imagekit.io/projectzilch/Placeholder.png",
      thumbnail: client.user.avatarURL(),
    });

    await interaction.editReply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    console.error(`[Error] Error in handlePlaceholderView function: ${error}`);
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

  configureRewardAdd,
  configureRewardRemove,
  configureRewardList,
  configureRewardStack,
  configureSetLevelChannel,

  configureSetLevelUpMessage,
  configurePlaceholderView,
};

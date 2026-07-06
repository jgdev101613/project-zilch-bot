const { ApplicationCommandOptionType, ChannelType } = require("discord.js");
const getGuildSettings = require("../../services/guildSettings");

// Handlers Import
const { leaderboard, rank } = require("./handlers");
// Configure Imports
const {
  handleVoiceEnable,
  handleVoiceXp,
  handleVoiceCooldown,
  handleVoiceMultiplier,
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
} = require("./configure");
// Admin Imports

module.exports = {
  name: "level",
  description: "Leveling system commands.",

  options: [
    // ==========================
    // Public Commands
    // ==========================

    {
      name: "rank",
      description: "View your rank card.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "leaderboard",
      description: "View the server leaderboard.",
      type: ApplicationCommandOptionType.Subcommand,
    },

    // ==========================
    // Configuration
    // ==========================

    {
      name: "configure",
      description: "Configure the leveling system.",
      type: ApplicationCommandOptionType.SubcommandGroup,

      options: [
        // VOICE
        {
          name: "voice-enable",
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
          name: "voice-xp",
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
          name: "voice-cooldown",
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
          name: "voice-multiplier",
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
          name: "voice-minimumusers",
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
          name: "voice-ignoredchannel",
          description: "Ignore or unignore a voice channel.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "channel",
              description: "Voice channel.",
              type: ApplicationCommandOptionType.Channel,
              required: true,
              channelTypes: [
                ChannelType.GuildVoice,
                ChannelType.GuildStageVoice,
              ],
            },
          ],
        },

        {
          name: "voice-ignoredrole",
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
          name: "voice-settings",
          description: "View current voice leveling settings.",
          type: ApplicationCommandOptionType.Subcommand,
        },

        // TEXT
        {
          name: "text-enable",
          description: "Enable or disable text leveling.",
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
          name: "text-xp",
          description: "Configure text XP range.",
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
          name: "text-cooldown",
          description: "Configure text XP cooldown.",
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
          name: "text-multiplier",
          description: "Configure text XP multiplier.",
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
          name: "text-minimum-message",
          description: "Minimum words required in a text channel.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "count",
              description: "Minimum number of words.",
              type: ApplicationCommandOptionType.Integer,
              required: true,
              minValue: 1,
            },
          ],
        },

        {
          name: "text-ignored-channel",
          description: "Ignore or unignore a text channel.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "channel",
              description: "Voice channel.",
              type: ApplicationCommandOptionType.Channel,
              required: true,
              channelTypes: [
                ChannelType.GuildVoice,
                ChannelType.GuildStageVoice,
              ],
            },
          ],
        },

        {
          name: "text-ignored-role",
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
          name: "text-settings",
          description: "View current text leveling settings.",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const group = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand();

    const settings = await getGuildSettings(interaction.guild.id);

    // ==========================
    // No Group
    // ==========================

    if (!group) {
      if (subcommand === "rank") {
        return rank(client, interaction);
      }

      if (subcommand === "leaderboard") {
        return leaderboard(client, interaction);
      }

      return;
    }

    // // ==========================
    // // Admin
    // // ==========================

    // if (group === "admin") {
    //   if (subcommand === "addxp") {
    //     return addXp(client, interaction);
    //   }

    //   if (subcommand === "removexp") {
    //     return removeXp(client, interaction);
    //   }

    //   return;
    // }

    // ==========================
    // Configure
    // ==========================

    if (group === "configure") {
      // Voice
      if (subcommand === "voice-enable") {
        return handleVoiceEnable(client, interaction, settings);
      }
      if (subcommand === "voice-xp") {
        return handleVoiceXp(client, interaction, settings);
      }
      if (subcommand === "voice-cooldown") {
        return handleVoiceCooldown(client, interaction, settings);
      }
      if (subcommand === "voice-multiplier") {
        return handleVoiceMultiplier(client, interaction, settings);
      }
      if (subcommand === "voice-minimumusers") {
        return handleVoiceMinimumUsers(client, interaction, settings);
      }
      if (subcommand === "voice-ignoredchannel") {
        return handleVoiceIgnoredChannel(client, interaction, settings);
      }
      if (subcommand === "voice-ignoredrole") {
        return handleVoiceIgnoredRole(client, interaction, settings);
      }
      if (subcommand === "voice-settings") {
        return handleVoiceSettings(client, interaction, settings);
      }
      // Text
      if (subcommand === "text-enable") {
        return handleTextEnable(client, interaction, settings);
      }
      if (subcommand === "text-xp") {
        return handleTextXp(client, interaction, settings);
      }
      if (subcommand === "text-cooldown") {
        return handleTextCooldown(client, interaction, settings);
      }
      if (subcommand === "text-multiplier") {
        return handleTextMultiplier(client, interaction, settings);
      }
      if (subcommand === "text-minimum-message") {
        return handleTextMinimumMessageLength(client, interaction, settings);
      }
      if (subcommand === "text-ignored-channel") {
        return handleTextIgnoredChannel(client, interaction, settings);
      }
      if (subcommand === "text-ignored-role") {
        return handleTextIgnoredRole(client, interaction, settings);
      }
      if (subcommand === "text-settings") {
        return handleTextSettings(client, interaction, settings);
      }
      return;
    }
  },
};

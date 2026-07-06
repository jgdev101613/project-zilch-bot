const {
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const GuildSettings = require("../../models/guildSettingsSchema");

module.exports = {
  name: "levelsettings",
  description: "Displays the current leveling configuration.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    const voiceIgnoredChannels =
      settings.leveling.voice.ignoredChannels.length > 0
        ? settings.leveling.voice.ignoredChannels
            .map((id) => `<#${id}>`)
            .join(", ")
        : "`None`";

    const voiceIgnoredRoles =
      settings.leveling.voice.ignoredRoles.length > 0
        ? settings.leveling.voice.ignoredRoles
            .map((id) => `<@&${id}>`)
            .join(", ")
        : "`None`";

    const textIgnoredChannels =
      settings.leveling.text.ignoredChannels.length > 0
        ? settings.leveling.text.ignoredChannels
            .map((id) => `<#${id}>`)
            .join(", ")
        : "`None`";

    const textIgnoredRoles =
      settings.leveling.text.ignoredRoles.length > 0
        ? settings.leveling.text.ignoredRoles
            .map((id) => `<@&${id}>`)
            .join(", ")
        : "`None`";

    const rewards =
      settings.leveling.rewardRoles.length > 0
        ? [...settings.leveling.rewardRoles]
            .sort((a, b) => a.level - b.level)
            .map(
              (reward) => `• **Level ${reward.level}** → <@&${reward.roleId}>`,
            )
            .join("\n")
        : "`No rewards configured`";

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("⚙️ Leveling Settings")
      .setDescription("Current configuration for the leveling system.")
      .addFields(
        {
          name: "📌 General",
          value:
            `**Status:** ${settings.leveling.enabled ? "🟢 Enabled" : "🔴 Disabled"}\n` +
            `**Reward Mode:** ${settings.leveling.stackRewards ? "Stack" : "Replace"}`,
        },
        {
          name: "⭐ Text XP Settings",
          value:
            `**XP Range:** ${settings.leveling.text.minXp} - ${settings.leveling.text.maxXp}\n` +
            `**Cooldown:** ${settings.leveling.text.cooldown / 1000}s\n` +
            `**Minimum Message Length:** ${settings.leveling.text.minimumMessageLength}\n` +
            `**Multiplier:** ${settings.leveling.text.xpMultiplier}x\n` +
            `**Ignored Channels:** ${textIgnoredChannels}\n` +
            `**Ignored Roles:** ${textIgnoredRoles}`,
        },
        {
          name: "⭐ Voice XP Settings",
          value:
            `**XP Range:** ${settings.leveling.voice.minXp} - ${settings.leveling.voice.maxXp}\n` +
            `**Cooldown:** ${settings.leveling.voice.cooldown / 1000}s\n` +
            `**Multiplier:** ${settings.leveling.voice.xpMultiplier}x\n` +
            `**Ignored Channels:** ${voiceIgnoredChannels}\n` +
            `**Ignored Roles:** ${voiceIgnoredRoles}`,
        },
        {
          name: "📢 Level Up Channel",
          value: settings.leveling.levelUpChannel
            ? `<#${settings.leveling.levelUpChannel}>`
            : "`Current Channel`",
        },
        {
          name: "🏅 Reward Roles",
          value: rewards,
        },
      )
      .setFooter({
        text: `Guild ID: ${interaction.guild.id}`,
      })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
    });
  },
};

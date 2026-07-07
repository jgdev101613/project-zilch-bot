const { Client, Message } = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");
const giveXp = require("../../services/giveXp");

const cooldowns = new Map();
const lastMessages = new Map();
const getRandomXp = require("../../utils/getRandomXp");
const XP_SOURCES = require("../../constants/xpSources");
/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    message.system ||
    message.webhookId
  ) {
    return;
  }

  try {
    // ==========================
    // Guild Settings
    // ==========================

    const settings = await getGuildSettings(message.guild.id);

    if (!settings.leveling.enabled) {
      return;
    }

    if (!settings.leveling.text.enabled) {
      return;
    }

    if (settings.leveling.text.ignoredChannels.includes(message.channel.id)) {
      // ==========================
      // Ignored Channels
      // ==========================

      return;
    }

    // ==========================
    // Ignored Roles
    // ==========================

    if (
      message.member.roles.cache.some((role) =>
        settings.leveling.text.ignoredRoles.includes(role.id),
      )
    ) {
      return;
    }

    // ==========================
    // Cooldown
    // ==========================

    const userGuildKey = `${message.guild.id}:${message.author.id}`;
    const cooldownExpiration = cooldowns.get(userGuildKey);

    if (cooldownExpiration && cooldownExpiration > Date.now()) {
      return;
    }

    // ==========================
    // Anti-Spam
    // ==========================

    const content = message.content.trim();

    if (
      content.length < settings.leveling.text.minimumMessageLength &&
      message.attachments.size === 0
    ) {
      return;
    }

    const normalized = content.toLowerCase();

    if (lastMessages.get(userGuildKey) === normalized) {
      return;
    }

    lastMessages.set(userGuildKey, normalized);

    // ==========================
    // Start Cooldown
    // ==========================

    cooldowns.set(userGuildKey, Date.now() + settings.leveling.text.cooldown);

    // ==========================
    // Give XP
    // ==========================

    await giveXp({
      client,
      member: message.member,
      settings,

      xp: getRandomXp(
        settings.leveling.text.minXp,
        settings.leveling.text.maxXp,
      ),

      source: XP_SOURCES.TEXT,

      announceChannel: message.channel,
    });
  } catch (error) {
    console.error("Error giving XP:", error);
  }
};

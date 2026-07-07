const { MessageFlags } = require("discord.js");

const {
  LEADERBOARD_CUSTOM_ID_PREFIX,
  createLeaderboardPayload,
  parseLeaderboardCustomId,
} = require("../../services/leaderboard/createLeaderboardPayload");

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  if (!interaction.customId.startsWith(`${LEADERBOARD_CUSTOM_ID_PREFIX}:`)) {
    return;
  }

  const parsed = parseLeaderboardCustomId(interaction.customId);

  if (Date.now() > parsed.expiresAt) {
    return interaction.reply({
      content:
        "⏰ This leaderboard has expired. Please run `/level leaderboard` again.",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (!parsed) return;

  if (interaction.user.id !== parsed.ownerId) {
    await interaction.reply({
      content: "Only the person who opened this leaderboard can change pages.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    await interaction.deferUpdate();

    const payload = await createLeaderboardPayload({
      guild: interaction.guild,
      ownerId: parsed.ownerId,
      page: parsed.page,
    });

    await interaction.editReply(payload);
  } catch (error) {
    console.error("[Leaderboard] Failed to change page:", error);
  }
};
